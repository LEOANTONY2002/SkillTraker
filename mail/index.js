import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "communication.changecx@gmail.com",
        pass: "dkelxnkouyryvvqn", 
    },
});

export const mailToPasswordChange = async (to, name, password) => {
    await transporter.sendMail({
        from: "ChangeCX", 
        to, 
        subject: "One Time Password", 
        text: "Password Change", 
        html: `
            Hi ${name},
            <br />
            Your password : <b>${password}</b>
            <br />
            This is the One Time Password, use this password to change a new password for your ChangeCX Skill Tool account
        `,
    });
}

export const mailToCertificateUpload = async (to, name, employeeName, skillName) => {
    await transporter.sendMail({
        from: "ChangeCX", 
        to, 
        subject: "One Time Password", 
        text: "Password Change", 
        html: `
            Hi ${name},
            <br />
            ${employeeName} has just updated a certificate for the skill ${skillName}.
            <br />
        `,
    });
}
