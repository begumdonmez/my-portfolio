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
        <section id="contact" className="contact-section">
            <h2 className="section-title">Message Me</h2>
            <div className="contact-container">
                <p className="contact-text">
                    I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
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

                    <button type="submit" className="contact-button">Send Message</button>
                </form>
            </div>
        </section>
    );
}

export default Contact;