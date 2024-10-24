/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/*.{html,js,ejs}","./views/admin/*.{html,js,ejs}","./views/user/*.{html,js,ejs}"],
  theme: {
    extend: {
      colors:{
        // primary colors
        'white-base':"#F3F3F3",
        'dark':"#191A23",
        'primary':"#FF5336",
        'asset-1':"#343EE5",
        'asset-2':"#7D97F4",


        'dark-grey':"DBDBDB",
        'table-dark':"#222222",

        // alert color
        'success-green':"#D9F7E7",
        "waiting-yellow":"#FFF0BB",
        "danger-red":"#FEE6E5",
        "success-green-dark":"#4AD991",
        "danger-red-dark":"#FE8983",
        
        // light color
  
        'primary-light':"#FE8983",
        'asset-1-light':"#EEF2FF",
        'dark-light':"#636364",
        'border-color':"#E2E8F0",
      },
      fontFamily:{
        "Custom":["Custom"]
      },

      fontSize:{
        'destop-h1':"60px",
        'destop-h2':"40px",
        'destop-h3':"30px",
        'destop-h4':"20px",
        'destop-p':"18px",

        // mobile font size

        "mobile-h1":"43px",
        "mobile-h2":"36px",
        "mobile-h3":"26px",
        "mobile-h4":"18px",
        "mobile-p":"16px"
      },
      borderRadius:{
        'desktop-form':"15px"
      }
    },
  },
  plugins: [],
}

