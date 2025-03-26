import { sendemail } from "./apicalls/email";
import { useState } from "react";
import { jsPDF } from "jspdf";
import "./App.css";

// const data = {
  // Sheet1: [
  //   {
  //     SNo: 1,
  //     Name: "loki",
  //     Email: "nm8602@srmist.edu.in",
  //     Title: "Associate Director HR",
  //     Company: "pipto",
  //   },
  //   {
  //     SNo: 2,
  //     Name: "yash",
  //     Email: "nm8602@srmist.edu.in",
  //     Title: "Associate Director HR",
  //     Company: "kepto",
  //   },
  //   {
  //     SNo: 3,
  //     Name: "krish",
  //     Email: "nm8602@srmist.edu.in",
  //     Title: "Associate Director HR",
  //     Company: "zepto it technology",
  //   },
//   ],
// };

// Function to add delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const App = () => {
  const [data, setdata] = useState("");
  const [failedEmails, setFailedEmails] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [totalEmails, setTotalEmails] = useState(0);

  const handleJsondata = (e) => {
    setdata(e.target.value);
    
  };


  const generatePDF = async (record) => {
    const Name = record.name || "sir/madom";
    const Company = record.Company || "Company";
    const doc = new jsPDF();
    doc.setFont("times", "normal");
    doc.setFontSize(12);

    const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const coverLetterText = `
  Naveen M
  naveenacp24@gmail.com | +91 9632557859
  LinkedIn: https://www.linkedin.com/in/naveen4455 | Portfolio: https://naveenm.in

  ${currentDate}

  ${Name}
  ${Company}

  Subject: Application for a Relevant Role at ${Company}

  Dear ${Name},

  I am reaching out to express my keen interest in any relevant opportunities at ${Company}. I am a 
  final-year Master of Computer Applications (MCA) student at SRM Institute of Science and Technology, with 
  expertise in Full-Stack Web Development using the MERN stack (MongoDB, Express.js, React.js, and Node.js).

  I have gained valuable experience working as a Web Developer Intern, where I enhanced my technical skills and 
  delivered successful projects. Additionally, I have independently completed freelance projects, including:
  
  - Tuition Management System – Implemented features like student and admin management, attendance, and 
      marks tracking, integrated with Twilio API for absent notifications.
  - Company Portfolio Website – Built a professional website for client engagement with integrated contact features 
      using Nodemailer.

  My strong foundation in JavaScript, Python, Data Structures and Algorithms (DSA), REST API integration, and 
  secure authentication mechanisms, enables me to develop secure and efficient applications. I am highly motivated 
  to apply my skills to contribute to ${Company}’s projects and goals.

  I have attached my resume for your review. I would love the opportunity to discuss how my skills align with 
  the needs of ${Company}. Please feel free to reach out at your convenience.
  Looking forward to your response.

  Best regards,  
  Naveen M`;

    const lineHeight = 7;
    let yPosition = 10;

    coverLetterText.split("\n").forEach((line) => {
        doc.text(line, 10, yPosition);
        yPosition += lineHeight;
    });

    const pdfBlob = doc.output("blob");

    // Convert PDF to Base64
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(pdfBlob);
        reader.onloadend = () => {
            resolve({
                filename: `Naveen_M_${Company.replace(/\s+/g, "_")}_Cover_Letter.pdf`,
                content: reader.result.split(",")[1], // Extract Base64 content
                encoding: "base64",
            });
        };
    });
};


  const handleSendEmails = async () => {
    setIsSending(true);
    setProgress(0);
    setFailedEmails([]);

    let jsondata;
  try {
    jsondata = JSON.parse(data); // Convert JSON string to an array
  } catch (error) {
    alert("Invalid JSON! Please check the format.");
    setIsSending(false);
    return;
  }

    setTotalEmails(jsondata.length);

    let failedList = [];

    for (let index = 0; index < jsondata.length; index++) {
      const record=jsondata[index]
      const Name=record.Name || "sir/madom";
      const Company=record.Company || "Company";
      const Email=record.Email 
      console.log(index)
      console.log(record)
      const coverLetterFile = await generatePDF(record);
      const payload = {
        name: Name,
        email: Email,
        subject: `Application for a Relevant Opportunity at ${Company}`,
        message: `
          Dear ${Name},

          I hope this message finds you well.

          I am reaching out to express my keen interest in any relevant opportunities at ${Company}. I am a final-year Master 
          of Computer Applications (MCA) student at SRM Institute of Science and Technology, with expertise in Full-Stack Web 
          Development using the MERN stack (MongoDB, Express.js, React.js, and Node.js).

          I have gained valuable experience working as a Web Developer Intern, where I enhanced my technical skills and delivered 
          successful projects. Additionally, I have independently completed freelance projects, including:

          ● Tuition Management System – Implemented features like student and admin management, attendance, and marks tracking, 
             integrated with Twilio API for absent notifications.  
          ● Company Portfolio Website – Built a professional website for client engagement with integrated contact features using 
             Nodemailer.

          My strong foundation in JavaScript, Python, Data Structures and Algorithms (DSA), REST API integration, and secure 
          authentication mechanisms enables me to build scalable, secure, and efficient applications

          Please find my resume and cover letter attached for your reference. I would be grateful for an opportunity to discuss how my 
          skills align with the needs of ${Company}.

          Thank you for considering my application. I look forward to the possibility of contributing to your team.

          Best regards,  
          Naveen M  
          LinkedIn: https://www.linkedin.com/in/naveen4455 | Portfolio: https://naveenm.in  
          +91 9632557859
        `,
        attachments: [coverLetterFile],
      };

      try {
        console.log(`Sending email to ${Email}...`);
        const response = await sendemail(payload);

        if (response.status === "success") {
          console.log(`✅ Success: Email sent to ${Email}`);
        } else {
          console.error(`❌ Failed to send email to ${Email} - ${response.message}`);
          failedList.push(record);
        }
      } catch (error) {
        console.error(`❌ Error sending email to ${Email} - ${error.message}`);
        failedList.push(record);
      }

      setProgress(index + 1);

      if (index < jsondata.length - 1) {
        console.log(`⏳ Waiting 3 seconds before sending the next email...`);
        await delay(3000);
      }
    }

    setFailedEmails(failedList);
    setIsSending(false);

    if (failedList.length === 0) {
      alert("✅ All emails sent successfully!");
    } else {
      alert(`❌ Failed to send ${failedList.length} email(s).`);
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Upload HR Contact Data</h2>
      <h6 style={{color:"red"}}>keys should be "Name" "Email" "Company" </h6>
      <textarea
        rows="15"
        cols="50"
        placeholder="Paste JSON data here..."
        value={data}
        onChange={handleJsondata}
        className="textarea"
      />
  
      <br />
  
      <button onClick={handleSendEmails} disabled={isSending} className="button">
        {isSending ? "Sending..." : "Send Emails"}
      </button>
  
      {totalEmails > 0 && (
        <div className="progress-container">
          <progress value={progress} max={totalEmails} className="progress-bar" />
          <p className="progress-text">{progress}/{totalEmails} emails sent</p>
        </div>
      )}
  
      {failedEmails.length > 0 && (
        <div className="failed-emails-container">
          <h2 className="failed-emails-heading">Failed Emails:</h2>
          <ul className="failed-emails-list">
            {failedEmails.map((record) => (
              <li key={record.Email} className="failed-email-item">
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
  
};

export default App;
