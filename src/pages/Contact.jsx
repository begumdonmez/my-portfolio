import "./Contact.css";
import emailjs from "@emailjs/browser";

function Contact() {
    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm(
            "service_fqn1bnf",
            "template_9i3kknb",
            e.target,
            "J-bgRYzBlNYxEWwAs"
        ).then(
            () => {
                alert("Message sent successfully!");
                e.target.reset();
            },
            () => {
                alert("Failed to send message.");
            }
        );
    };

    return (
        <div className="contact">
            <div className="contact-wrapper">
                <div className="contact-left">
                    <h1>Message Me</h1>

                    <p className="contact-text">
                        Feel free to leave me a message. I will get back to you as soon as
                        possible.
                    </p>

                    <form className="contact-form" onSubmit={sendEmail}>
                        <div className="form-group">
                            <label htmlFor="name">Your Name</label>
                            <input
                                id="name"
                                type="text"
                                name="from_name"
                                placeholder="Enter your name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                name="from_email"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                placeholder="Write your message..."
                                required
                            />
                        </div>

                        <button type="submit">Send Message</button>
                    </form>
                </div>

                <div className="contact-right">
                    <img
                        src="/begu.png"
                        alt="Begu Character"
                        className="character-img"
                    />
                </div>
            </div>
        </div>
    );
}

export default Contact;
