module.exports = {
  button: {
    text: 'Send as a gift',
    bgColor: '#191919',
    txtColor: '#ffffff',
    borderColor: '#191919',
    hoverBgColor: '#302d2d',
    hoverTxtColor: '#ffffff',
    hoverBorderColor: '#302d2d',
    padding: { top: 10, right: 20, bottom: 10, left: 20 },
    margin: { top: 5, right: 0, bottom: 5, left: 0 },
    borderRadius: 4,
    place: 'Before',
    icon: true,
    iconColor: '#ffffff',
    hoverIconColor: '#ffffff'
  },
  popup: {
    image: '',
    texts: {
        title: "Send As a Gift",
        line1: "Select the items you'd like to gift",
        line2: "Purchase with the shipping address of the recipient",
        line3: "They receive an email of the gift with your message",
        line4: "They receive your gift and say thank you!",
        to: "To",
        from: "From",
        message: "Message",
        rname: "Recipient Full Name",
        remail: "Recipient Email",
        yname: "Your Full Name",
        yemail: "Your Email",
        ymessage: "Your Message"
    },
    closeColor: "#191919",
    title: {
        fontSize: 32,
        txtColor: '#191919'
    },
    lines: {
        fontSize: 16,
        txtColor: '#191919'
    },
    buttons: {
        texts: {
            start: "Send Your Gift",
            "back": "Back",
            "submit": "Buy"
        },
        padding: { top: 10, right: 20, bottom: 10, left: 20 },
        borderRadius: 4,
        next: {
            bgColor: '#191919',
            txtColor: '#ffffff',
            borderColor: '#191919',
            hoverBgColor: '#302d2d',
            hoverTxtColor: '#ffffff',
            hoverBorderColor: '#302d2d'
        },
        prev: {
            bgColor: '#ffffff',
            txtColor: '#191919',
            borderColor: '#d2d2d2',
            hoverBgColor: '#d2d2d2',
            hoverTxtColor: '#191919',
            hoverBorderColor: '#d2d2d2'
        }
    }
  }
};