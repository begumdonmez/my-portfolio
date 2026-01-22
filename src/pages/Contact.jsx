import "./Contact.css";
import emailjs from "@emailjs/browser";

function Contact() {

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm(
            "service_fqn1bnf",        // ✅ Service ID
            "template_9i3kknb",       // ✅ Template ID
            e.target,
            "J-bgRYzBlNYxEWwAs"       // ❗ EmailJS Public Key
        )
            .then(
                () => {
                    alert("Message sent successfully!");
                    e.target.reset();
                },
                (error) => {
                    console.log(error.text);
                    alert("Failed to send message.");
                }
            );
    };

    return (
        <div className="contact">
            <div className="container">
                <h1>Message Me</h1>

                <p className="contact-text">
                    Feel free to leave me a message. I will get back to you as soon as
                    possible.
                </p>

                <form className="contact-form" onSubmit={sendEmail}>
                    <div className="form-group">
                        <label>Your Name</label>
                        <input
                            type="text"
                            name="from_name"
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="from_email"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Message</label>
                        <textarea
                            name="message"
                            placeholder="Write your message..."
                            required
                        />
                    </div>

                    <button type="submit">Send Message</button>
                </form>
            </div>
        </div>
    );
}

export default Contact;
