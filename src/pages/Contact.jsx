import "./Contact.css";

function Contact() {
    return (
        <div className="contact">
            <div className="container">
                <h1>Message Me</h1>

                <p className="contact-text">
                    Feel free to leave me a message. I will get back to you as soon as
                    possible.
                </p>

                <form className="contact-form">
                    <div className="form-group">
                        <label>Your Name</label>
                        <input type="text" placeholder="Enter your name" />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" placeholder="Enter your email" />
                    </div>

                    <div className="form-group">
                        <label>Message</label>
                        <textarea placeholder="Write your message..." />
                    </div>

                    <button type="submit">Send Message</button>
                </form>
            </div>
        </div>
    );
}

export default Contact;
