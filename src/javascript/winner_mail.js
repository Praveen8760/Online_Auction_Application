function sendWinnerEmail(winnerEmail, auctionTitle, winningAmount) {
    console.log(`Sending email to ${winnerEmail} for auction ${auctionTitle}...`);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com', // Replace with your email
            pass: 'your-email-password' // Replace with your password or use OAuth2
        }
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: winnerEmail,
        subject: 'Congratulations! You won the auction',
        text: `Dear bidder,
        Congratulations! You have won the auction "${auctionTitle}" with a bid of $${winningAmount}.

        Best regards,
        The Auction Team`
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
