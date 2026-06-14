// src/common/common.js

export const theme = {
  colors: {
    forestGreen: "#2F6F4E",
    forestGreenDark: "#24563C",
    forestGreenLight: "#4F8F6D",

    cream: "#FAF6ED",
    creamDark: "#F2EAD8",

    softGold: "#D4A857",
    softGoldLight: "#E6C98E",

    lightBlue: "#7DB8DA",
    lightBlueLight: "#CFE8F4",

    white: "#FFFFFF",

    textPrimary: "#2C2C2C",
    textSecondary: "#5B5B5B",

    success: "#2E8B57",
    warning: "#D97706",
    danger: "#DC2626",
  },

  typography: {
    heroTitle:
      "text-5xl md:text-6xl font-bold leading-tight",

    pageTitle:
      "text-3xl md:text-4xl font-bold",

    sectionTitle:
      "text-2xl md:text-3xl font-semibold",

    body:
      "text-base md:text-lg",

    small:
      "text-sm",
        authTitle:
    "text-3xl font-bold text-center",

  authSubtitle:
    "text-sm text-gray-500 text-center",
    formLabel:
  "block text-sm font-medium text-gray-700 mb-2",

  modalTitle:
    "text-3xl font-bold text-[#2F6F4E]",

  modalSubtitle:
    "text-gray-500 mt-2 leading-relaxed",
  },

  radius: {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-3xl",
    full: "rounded-full",
  },

  shadows: {
    soft: "shadow-md",
    medium: "shadow-lg",
    floating: "shadow-2xl",
  },

  spacing: {
    page: "px-6 md:px-12",
    section: "py-16",
    container: "max-w-7xl mx-auto",
  },

  layouts: {
    hero: "min-h-screen flex items-center",
    authWrapper:
      "min-h-screen flex items-center justify-center",
      authPage:
  "min-h-screen flex items-center justify-center px-6",
  dashboardGrid:
  "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6",
   authContainer:
    "max-w-md w-full",
  },

  inputs: {
    primary:
      "w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-700",
      search:
  "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-green-700",
    error:
    "border-red-500 focus:ring-red-500",
  },

  buttons: {
    primary:
      "bg-green-700 text-white hover:bg-green-800 transition-all duration-300",

    secondary:
      "bg-sky-500 text-white hover:opacity-90 transition-all duration-300",

    gold:
      "bg-yellow-600 text-white hover:opacity-90 transition-all duration-300",

    outline:
      "border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white transition-all duration-300",

      fullWidth:
  "w-full",
  fab:
  "fixed bottom-6 right-6 rounded-full px-6 py-4 shadow-xl",
    danger:
    "bg-red-600 text-white hover:bg-red-700 transition-all duration-300",
      primaryFull:
    "w-full bg-[#2F6F4E] text-white py-3 rounded-2xl hover:bg-[#24563C] transition-all duration-300",
     loading:
    "opacity-80 cursor-not-allowed",
     icon:
  "w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition",

    primaryLarge:
    "bg-green-700 text-white hover:bg-green-800 transition-all duration-300 rounded-2xl py-4 px-6 w-full font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5",
  },

  cards: {
    trip:
      "bg-white rounded-3xl shadow-lg",

    feature:
      "bg-white rounded-2xl shadow-md",

    glass:
      "bg-white/70 backdrop-blur-md rounded-3xl shadow-lg",

      auth:
  "bg-white rounded-3xl shadow-xl p-8",

  dashboardTrip:
  "bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all duration-300",
    modal:
  "bg-white rounded-3xl shadow-xl p-8",
  dashboardHero:
  "bg-gradient-to-r from-[#2F6F4E] to-[#4F8F6D] text-white rounded-3xl shadow-xl p-8",

dashboardNavbar:
  "bg-white rounded-3xl shadow-md px-6 py-4",

dashboardSection:
  "bg-white rounded-3xl shadow-lg p-6",
   authGlass:
    "bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8",
     attention:
  "bg-white rounded-3xl shadow-xl p-8",

 trip:
  "bg-white rounded-3xl overflow-hidden shadow-lg",

 dropdown:
  "bg-white rounded-2xl shadow-xl border border-gray-100",
  attention:
    "bg-white rounded-3xl shadow-xl p-8",

  tripCard:
    "bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300",

  dropdown:
    "bg-white rounded-2xl shadow-xl border border-gray-100",
      attentionPrimary:
    "bg-gradient-to-r from-[#2F6F4E] to-[#4F8F6D] text-white rounded-3xl shadow-xl p-8",

  attentionSecondary:
    "bg-white rounded-3xl shadow-lg p-8",

 attentionEmpty:
  "bg-white rounded-3xl shadow-lg p-8",

  createJourney:
    "bg-white rounded-3xl shadow-2xl p-8",
      tripHero:
    "relative overflow-hidden rounded-3xl shadow-xl",

  tripOverview:
    "bg-white rounded-3xl shadow-lg p-6",

  memberRow:
    "flex items-center justify-between p-4 rounded-2xl hover:bg-[#FAF6ED] transition-all duration-200 cursor-pointer",

  statCard:
    "bg-[#FAF6ED] rounded-2xl p-4",

  memberAvatar:
    "w-14 h-14 rounded-full bg-[#2F6F4E] text-white flex items-center justify-center text-xl font-semibold",

  adminBadge:
    "px-2 py-1 rounded-full text-xs bg-[#FAF6ED] text-[#2F6F4E]",
actionCard:
  "rounded-2xl border border-gray-200 p-4 hover:bg-[#FAF6ED] transition-all duration-200 cursor-pointer",
  profileCard:
`
bg-[#FAF6ED]
rounded-3xl
p-8
text-center
shadow-sm
`,
 searchResult:
    `
    flex
    items-center
    justify-between
    p-4
    rounded-2xl
    transition-all
    duration-200
    hover:bg-[#FAF6ED]
    `,
  },

  tabs: {

  trip:
    "flex gap-2 overflow-x-auto pb-2",

  tab:
    "px-5 py-3 rounded-2xl transition-all duration-200 whitespace-nowrap",

  active:
    "bg-[#2F6F4E] text-white",

  inactive:
    "bg-white text-gray-600 hover:bg-[#FAF6ED]",

     tripSection:
    "bg-white rounded-3xl shadow-lg p-6",

  statMini:
    "bg-[#FAF6ED] rounded-2xl p-4",
},

  gradients: {
  hero:
    "bg-gradient-to-br from-[#FAF6ED] via-[#F2EAD8] to-[#CFE8F4]",

  section:
    "bg-gradient-to-r from-[#FAF6ED] to-[#FFFFFF]",
    

},
animations: {
 fadeIn:
    "transition-opacity duration-300",

  slideUp:
    "transition-all duration-300",

  scaleIn:
    "transition-transform duration-300",

  hoverLift:
    "hover:-translate-y-1 transition-all duration-300",

  cardHover:
    "hover:-translate-y-2 hover:shadow-xl transition-all duration-300",

  tripHover:
    "hover:-translate-y-1 transition-all duration-300",

  imageZoom:
    "group-hover:scale-105 transition-transform duration-500",

  fadeUp:
    "animate-fadeIn",
     modal:
    "animate-in fade-in zoom-in duration-200",
      drawer:
    "transition-transform duration-300 ease-out",

     drawerOpen:
    "translate-x-0 opacity-100",

  drawerClosed:
    "translate-x-full opacity-0",

  drawerTransition:
    "transition-all duration-300 ease-out",
},

tripLayouts: {

  overviewGrid:
    "grid grid-cols-1 xl:grid-cols-2 gap-6",

  statsGrid:
    "grid grid-cols-2 gap-4",
},

trip: {

  page:
    "space-y-6",

  hero:
    "relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2F6F4E] to-[#4F8F6D] text-white p-8 shadow-xl",

  contentGrid:
    "grid grid-cols-1 xl:grid-cols-2 gap-6",
},

backdrop: {
  modal:
    "fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50",
},

status: {
  upcoming: {
    bg: "bg-blue-100",
    text: "text-blue-700",
  },

  ongoing: {
    bg: "bg-green-100",
    text: "text-green-700",
  },

  completed: {
    bg: "bg-gray-100",
    text: "text-gray-700",
  },
},

badges: {
  admin:
    "bg-green-100 text-green-700",

  creator:
    "bg-yellow-100 text-yellow-700",

  member:
    "bg-blue-100 text-blue-700",

  unread:
    "bg-red-100 text-red-700",
},

modals: {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
},
links: {
  auth:
    "text-[#2F6F4E] hover:text-[#24563C] font-medium transition-colors",
},
navbar: {
  container:
    "bg-white rounded-3xl shadow-md px-6 py-4",

  icon:
    "w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition",
},
dropdown: {
 item:
  "px-4 py-3 hover:bg-gray-50 cursor-pointer transition",
},
emptyState: {

  container:
    "bg-white rounded-3xl shadow-lg p-12 text-center",
},
skeleton: {
 card:
  "animate-pulse bg-gray-200 rounded-3xl",
},
sectionTitles: {
  dashboard:
    "text-2xl md:text-3xl font-bold text-[#2F6F4E]",
},

skeleton: {
  card:
    "animate-pulse bg-gray-200 rounded-2xl",

  line:
    "animate-pulse bg-gray-200 rounded-full",

  attention:
    "animate-pulse bg-white rounded-3xl shadow-xl p-8",

  trip:
    "animate-pulse bg-white rounded-3xl shadow-lg p-6",
},

drawer: {

  overlay:
    "fixed inset-0 bg-black/40 z-40",

  panel:
    `
    fixed
    top-0
    right-0
    h-full
    w-full
    md:w-[420px]
    lg:w-[460px]
    bg-white
    shadow-2xl
    p-6
    overflow-y-auto
    `,

  header:
    "flex items-center justify-between mb-8",

},
modal: {

  searchResults:
    `
    max-h-[400px]
    overflow-y-auto
    space-y-2
    `,
},

itinerary: {

  timeline:
    `
    relative
    pl-8
    `,

  dayGroup:
    `
    mb-10
    `,

  dayTitle:
    `
    text-xl
    font-bold
    text-[#2F6F4E]
    mb-2
    `,

  eventLine:
    `
    absolute
    left-3
    top-0
    bottom-0
    w-[2px]
    bg-[#DCE8E1]
    `,

  eventDot:
    `
    absolute
    left-0
    top-6
    w-6
    h-6
    rounded-full
    bg-[#2F6F4E]
    border-4
    border-white
    shadow
    `,
},














};