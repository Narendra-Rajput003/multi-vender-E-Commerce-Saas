import nodemailer from "nodemailer"
import dotenv from "dotenv"
import ejs from "ejs"
import path from "path"

dotenv.config()

const transporter  = nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port:Number(process.env.SMTP_PORT)|| 587,
    service:process.env.SMTP_SERVICE,
    auth:{
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASS
    }
})



const renderEmailTemplate = async (
  templateName: string,
  data: Record<string, any>
): Promise<string> => {
  try {
    const templatePath = path.join(
      process.cwd(),
      "auth-service",
      "src",
      "utils",
      "email-templates",
      `${templateName}.ejs`
    );

    const html = await ejs.renderFile(templatePath, data);
    return html;
  } catch (error) {
    console.error("Error rendering email template:", error);
    throw new Error("Failed to render email template.");
  }
};


///send an email using nodemailer 

export const sendEmail=async(to:string,subject:string,templateName:string,data:Record<string,any>)=>{

    try {
        const html = await renderEmailTemplate(templateName,data)

        await transporter.sendMail({
            from:`${process.env.SMTP_USER}`,
            to,
            subject,
            html
        })

        return true
    } catch (error) {
        console.log("Error in sending email",error)
        return false
    }

}