
const {Router} = require('express');
const router = Router();
const {createuser,checkuser,AddBlog} = require('../controllers/user');
const multer = require('multer');
const path = require('path');
const  blog = require('../models/blog');
const comment = require('../models/comment');
const USER = require('../models/user');
const {jwtDecode } = require('jwt-decode');
const { error, log } = require('console');
const { randomBytes } = require('crypto');
const crypto = require('crypto');
const {GoogleGenerativeAI} = require('@google/generative-ai');
const ques  = require('../models/prompt');
const passport = require('passport');
const like = require('../models/like');
const { default: mongoose } = require('mongoose');


// router.get('/auth/google',
//     passport.authenticate('google', { scope: ['profile'] }));
  
// router.get('/auth/google/callback', 
// passport.authenticate('google', { failureRedirect: '/login' }),
// function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
// });












require('dotenv').config();


router.get('/', async (req,res)=>{ ////***


   const allblog = await blog.find({});

   const test =await req.cookies["token"];

//    console.log(test);
   

   const find_user = test ? jwtDecode(test) : null;


   const user_name = find_user?.payload;
   

    return res.render('home',{

        blogs:allblog,
        checkCookie:test,
        newuser:user_name,




    })
})

router.get('/signup',(req,res)=>{
    return res.render('signup');
});


router.get('/signin',(req,res)=>{
    return res.render('login');
});


router.post('/signup',createuser);

router.post('/signin',checkuser);

// Clear cookies...

router.get('/logout',(req,res)=>{

    res.clearCookie("token").redirect('/');
});


router.get("/addblog", async (req,res)=>{

    const test = await req.cookies["token"];
    const exist = "exist";                  

    const user_data = test ? jwtDecode(test) : null;
 
    return res.render("addblog",{
        checkCookie:test,
        newuser:user_data.payload,
        exist,
        

        
    });
});


// Manage the cover image...(Disk Storage)


// const storage = multer.diskStorage({

//     destination: function (req, file, cb) {
//       cb(null, path.resolve(__dirname,`../public/uploads`));
//     },
//     filename: function (req, file, cb) {
//       const fileName = `${Date.now()}-${file.originalname}`;
//       cb(null,fileName);
//     }
//   })
  

// const upload = multer({ storage: storage });

//  


router.post("/addblog", async (req,res)=>{

    try{

    const {title,body} = req.body;

    const fileURL = req.body?.file;


    // console.log("URL is:",fileURL);
    

    if(! title || !body || !fileURL){

        throw new error("please fill the input field");
    }

    const cookie =await req.cookies["token"];

    const find_user = cookie ? jwtDecode(cookie) : null;

    const user_data = find_user?.payload;

    

    const newblog = await blog.create({

        title,
        body,
        coverImg:fileURL,
        createdBy:user_data._id

    });
    

    return res.redirect("/");

}

catch(err){

        // console.log(err);
        
    return res.render('addblog',{
        error:"please fill the details"
    })
}


});

// ============================================================================


// open one card and then view

router.get('/blog/:id',async (req,res)=>{

    try{

    const id = req.params.id;   
    

    
    
    const finduserblog = await blog.findById(id);


        // console.log(finduserblog);

    const _id = finduserblog._id;

    // console.log(_id);   // Blog id direct get here
    
        
      
    const ID = finduserblog.createdBy
    
    // console.log(ID);
    

    const temp = await USER.findById(ID); 

    // console.log(temp);
    

    // req.session.user=temp;

    const Comment = await comment.findOne({blogid:id});

    const list_comment = await comment.find({});    // allcoment

    const alluser = await USER.find({}); // alluser


    const blogid = Comment ? Comment.blogid : null;

 
    const test = req.cookies["token"];

    const data = test ? jwtDecode(test) : null;

    const user_data = data?.payload;

    
    // console.log(like.likecount);

    // console.log(JSON.stringify(blogid));

        
    
    return res.render('viewblog',{
        blog:finduserblog,
        user:temp,
        comments:Comment,
        lis:list_comment,
        blogId:blogid,
        checkCookie:test,
        newuser:user_data,
        lis_user:alluser,
        ID,
        temp,
        count:0,
        _id
        

    });

}
catch(err){

    // console.log("Error occur",err);
    return;
    
}
});


router.post('/likepost/:id',async (req,res)=>{

    const id = req.params.id;
    const body = req.body;
    const ID = await blog.findById(id);
    console.log(body);

    // await mongoose.create({
    //     blogId:ID?._id
    //     likecount:
    // })

    return res.redirect(`/blog/${id}`);
    

})














// make a comment path ....


router.post("/blog/comment/:blogid", async (req,res)=>{

    const val = req.params.blogid;

    const test = await req.cookies["token"];

    const data = test ? jwtDecode(test) : null;

 
    
    const body = req.body;

    // console.log(user.createdBy);
    
    const Comment = await comment.create({

        content:body.content,
        blogid:val,
        createdBy:data?.payload?._id,
        

    });

    return res.redirect(`/blog/${val}`);

});



// Update the user blog

router.get('/addblog/update/:id', async(req,res)=>{

    const id = req.params.id;

    const TestBlog = await blog.findById(id);

    const title = TestBlog.title;
    const body = TestBlog.body;
    const image = TestBlog.coverImg;


    return res.render('update',{

        title,
        image,
        body,
        id
    });
})





// delete the user blog 

router.get('/addblog/delete/:id', async (req,res)=>{


    const id = req.params.id;

    const TestBlog = await blog.findById(id)

    const title = TestBlog.title;
    const body = TestBlog.body;
    const image = TestBlog.coverImg;

    
    return res.render('delete',{

        title,
        body,
        id,
        image
        
    });
})



// ================================= Update the cover image ========================================================

  
router.post("/addblog/update/:id", async (req,res)=>{

    try{

    const {title,body} = req.body;

    const id = req.params.id;
    const fileURL = req.body.file;

    if(!title || !body || !fileURL){
        throw new error("Error is occur");
    }

     await blog.findByIdAndUpdate(id,{

        title:title,
        body:body,
        coverImg:fileURL,

    })
    

    return res.redirect("/");
}

catch(err){
    // console.log(err)
    return res.render('addblog',{
        error:"Please fill the details"
    });
}

});


// ====================================== Using post request to delete the blog ===============================================

router.post('/addblog/delete/:id', async (req,res)=>{

    try{

    const ID = req.params.id;

    const deleteblog = await blog.findByIdAndDelete(ID);

    const test = await req.cookies["token"];
    
    const find_data = test ? jwtDecode(test) : null;

    const user_data =find_data?.payload;

    return res.redirect('/'); 

    }
    catch(err){

        res.status(404).json({message:"Blog is not found"});
    }

});

// ========================= Request for Genai And Forgot password ================================================

router.get('/forgotpassword',(req,res)=>{

    return res.render('forgotpassword');

})


router.get('/AI', async (req,res)=>{

    const test = await req.cookies["token"];

    return res.render('AI',{
        checkCookie:test
    });
})

// ===============================Forgot password ==========================================================

router.post('/forgotpassword', async (req,res) =>{

    const {pass,email} = req.body;

    const find_user  = await USER.findOne({email});

    const id = find_user._id;

    // console.log(id)
    
    const newsalt = randomBytes(16).toString();
    const newhashpassword = crypto.createHmac('sha256',newsalt)
    .update(pass)
    .digest("hex");

    await USER.findByIdAndUpdate(id,{

        password:newhashpassword,
        salt:newsalt

    });
     
    // console.log(newhashpassword);
    // console.log(pass);

    
     return res.redirect('/user/signin');
   
  
    
    });


// ==================== For GenAI =================================================

    router.post("/AI", async (req,res)=>{

        const {prompt} = req.body;

        const test = await req.cookies["token"];

        const user = test ? jwtDecode(test) : null;

        // console.log(user);
        


        await ques.create({
            question:prompt,
            name:user?.payload?.name,
            email:user?.payload?.email
        });

        const Genai = new GoogleGenerativeAI("AIzaSyDRwyUEwzFF_E1MiVMYptPTVb7BXJnKbZM");

        const model = Genai.getGenerativeModel({model:"gemini-2.0-flash"});

        const generate = async (prompt) =>{

            try{

                    const result = await model.generateContent(prompt);
                    return result.response.text();
            }
            catch(err){
                // console.log("Error is occur");
                
            }
        }

        

        const result = await generate(prompt);

        // console.log(result);

        return res.render('AI',{

            data:result

        });
      
    
    return ;

     })

  

 router.get('/profileImageUpdate/:id',async (req,res)=>{

    const id = req.params.id;

    const bloguserid = await blog.findOne({createdBy:id});

    const test = await req.cookies["token"];


    const data = test ? jwtDecode(test) : null;

    const user_data = data?.payload;


    // console.log(bloguserid._id);

    const user_pic = await USER.findById(user_data._id);

    // console.log(user_pic);
    
    
    
   
    return res.render('profileupdate',{
        profile_user:user_pic,
        // id:bloguserid._id
        

    

    });
 });


router.post('/profileImageUpdate/:id' ,async (req,res)=>{


    try{

    const id = req.params.id;

    // const bloguserId = await blog.findOne({createdBy:id});

    // const blogID = JSON.stringify(bloguserId._id);
    
//    console.log(req.file.filename);
//    console.log(id);



        const fileURL = req.body.file;

        if(!fileURL){
            throw new error("Please enter the image")
        }
   
   

    await USER.findByIdAndUpdate(id,{

        profileImage:fileURL,

        
    });


    return res.redirect('/');

}
catch(err){

    return res.render('profileupdate',{
        error:"please fill the empty filled"
    })
}

})


router.get('/myblog', async (req,res) =>{

    const allblog = await blog.find({});

    const test = await req.cookies["token"];

    const data = test ? jwtDecode(test) : null ;

    const blog_id = data?.payload?._id;

    // console.log(allblog[0].createdBy);
    // console.log(blog_id)
    


    return res.render('myblog',{

        user_blog_id:blog_id,
        blogs:allblog,
        checkCookie:test


    })
})








module.exports = router;