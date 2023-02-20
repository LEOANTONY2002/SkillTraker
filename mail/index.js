import nodemailer from 'nodemailer'

export const mail = async () => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        auth: {
          user: "leoantony20015@gmail.com", // generated ethereal user
          pass: "Tesla@369", // generated ethereal password
        },
    });
    
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <leo.antony@changecx.com>', // sender address
        to: "leo.antony@changecx.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });

    console.log(info)
}