import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;


var pwd=[];
// Temporary in-memory blog data
let blogs = [
  {
      id: 1,
      title: "My First Blog",
      content: "This is the content of the first blog. It’s amazing!",
      author: "John Doe",
      createdAt: new Date("2024-12-01"),
  },
  {
      id: 2,
      title: "A Day in the Life",
      content: "Sharing experiences and stories from my daily routine.",
      author: "Jane Smith",
      createdAt: new Date("2024-12-05"),
  },
];

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true })); 

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
  res.render("index"); // Corrected path
});

app.get("/index", (req, res) => {
  res.render("index.ejs"); // Corrected path
});

app.get("/about", (req, res) => {
  res.render("about"); // Corrected path
});

app.get("/contact", (req, res) => {
  res.render("contact"); // Corrected path
});

app.post("/contact", (req, res) => {
  const { firstname, lastname, company, email, phonenumber, message } = req.body;

  // Log the contact form submission
  console.log(`Contact Form Submission: 
      First Name: ${firstname}, 
      Last Name: ${lastname}, 
      Company: ${company}, 
      Email: ${email}, 
      Phone Number: ${phonenumber}, 
      Message: ${message}`);

  // Here you can add logic to save the contact message to a database or send an email

  // Respond to the user
  res.send("Thank you for your message! We will get back to you soon.");
});

app.get("/signup", (req, res) => {
  res.render("signup"); // Corrected path
});

app.get("/blogs", (req, res) => {
  res.render("blogs"); // Corrected path
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  // Hash the password
  pwd.push([email,password]);
  // Store the user data (email and hashed password)
  
  

 // For demonstration, log the users array
  console.log(pwd);
  // Redirect or respond after signup
  res.send("User  registered successfully!");
});

app.post('/handle-blog', (req, res) => {
  const { blogId, action } = req.body;
  // Handle different actions based on the 'action' value
  if (action === 'create') {
      res.render("create.ejs")
  } 
   else if (action === 'display') {
      res.render("display.ejs",{blogs})
  } else  if (action === 'delete') {
    
    // Convert `blogId` to a number since IDs in `blogs` are numbers
    const idToDelete = parseInt(blogId, 10);

    // Filter out the blog with the matching ID
    const initialLength = blogs.length;
    blogs = blogs.filter(blog => blog.id !== idToDelete);

    // Log the deletion result
    if (blogs.length < initialLength) {
      console.log(`Blog with ID ${blogId} deleted successfully.`);
    } else {
      console.log(`No blog found with ID ${blogId}.`);
    }

    // Re-render updated blogs
    res.render("display.ejs", {blogs});
  } else {
    res.status(400).send('Invalid action');
  }
});


app.post("/show-update-form", (req, res) => {
  const { blogId } = req.body;
  const blogToEdit = blogs.find(blog => blog.id === parseInt(blogId, 10));

  if (!blogToEdit) {
      return res.status(404).send("Blog not found");
  }

  // Render the update form with the selected blog's details
  res.render("update", { blog: blogToEdit });
});

 
app.post("/update-blog", (req, res) => {
  const { id, title, content, author } = req.body;

  // Find the blog by ID and update its details
  const blogIndex = blogs.findIndex(blog => blog.id === parseInt(id, 10));
  if (blogIndex === -1) {
      return res.status(404).send("Blog not found");
  }

  // Update the blog's details
  blogs[blogIndex] = {
      ...blogs[blogIndex],
      title,
      content,
      author,
      updatedAt: new Date(),
  };

  console.log(`Blog with ID ${id} updated successfully.`);

  // Redirect to the display page
  res.redirect("/display-blogs");
});





// In-memory storage for blogs (replace with database later)

app.post('/submit-blog', (req, res) => {
  const { blogId, title, content, author } = req.body;

  // Validate inputs (basic validation for demonstration)
  if (!blogId || !title || !content || !author) {
      return res.status(400).send('All fields are required!');
  }

  // Check if the blog ID already exists
  const existingBlog = blogs.find(blog => blog.id === parseInt(blogId));
  if (existingBlog) {
      return res.status(400).send('Blog ID already exists!');
  }

  // Create a new blog object
  const newBlog = {
      id: parseInt(blogId), // Use the provided blog ID
      title,
      content,
      author,
      createdAt: new Date(),
  };

  // Save the blog
  blogs.push(newBlog);

  // Respond or redirect
  res.render("display.ejs", { blogs });
});

app.get('/display-blogs', (req, res) => {
  res.render('display.ejs',{blogs});
});

app.get("/welcome", (req, res) => {
  res.render("welcome");
});

// Welcome post route
app.post("/welcome", (req, res) => {
  

  // Log username to simulate processing
  console.log(`New user has entered`);

  // Render welcome page with dynamic greeting
  res.render("welcome");
});




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
