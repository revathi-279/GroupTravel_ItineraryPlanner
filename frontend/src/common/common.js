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

    // Elevated from harsh #2C2C2C to an elegant, soft earthy charcoal/pine
    textPrimary: "#1E2923", 
    textSecondary: "#526359",

    success: "#2E8B57",
    warning: "#D97706",
    danger: "#DC2626",
  },

  typography: {
    heroTitle: "text-5xl md:text-6xl font-bold leading-tight text-[#1E2923]",
    pageTitle: "text-3xl md:text-4xl font-bold text-[#1E2923]",
    sectionTitle: "text-2xl md:text-3xl font-semibold text-[#2F6F4E]",
    body: "text-base md:text-lg text-[#526359]",
    small: "text-sm text-[#526359]",
    authTitle: "text-3xl font-bold text-center text-[#1E2923]",
    authSubtitle: "text-sm text-[#526359] text-center",
    formLabel: "block text-sm font-semibold text-[#526359] mb-2 regional-tracking",
    modalTitle: "text-3xl font-bold text-[#2F6F4E]",
    modalSubtitle: "text-[#526359] mt-2 leading-relaxed text-sm",
  },

  radius: {
    sm: "rounded-xl",     // Increased radius slightly to feel softer/friendlier
    md: "rounded-2xl",
    lg: "rounded-3xl",
    xl: "rounded-[32px]",
    full: "rounded-full",
  },

  shadows: {
    // Softened shadows using an earthy undertone instead of dark black masks
    soft: "shadow-[0_8px_30px_rgb(47,111,78,0.04)]",
    medium: "shadow-[0_12px_40px_rgb(47,111,78,0.07)]",
    floating: "shadow-[0_20px_50px_rgb(47,111,78,0.12)]",
  },

  spacing: {
    page: "px-6 md:px-12 py-8",
    section: "py-12",
    container: "max-w-7xl mx-auto",
  },

  layouts: {
    hero: "min-h-screen flex items-center bg-[#FAF6ED]",
    authWrapper: "min-h-screen flex items-center justify-center bg-[#FAF6ED]",
    authPage: "min-h-screen flex items-center justify-center px-6 bg-[#FAF6ED]",
    // Canvas background changed to cream to let pure white components pop!
    mainCanvas: "min-h-screen bg-[#FAF6ED] text-[#1E2923]", 
    dashboardGrid: "grid grid-cols-1 lg:grid-cols-3 gap-8",
    authContainer: "max-w-md w-full",
  },

  inputs: {
    // Inputs now use a warm cream background nested inside the pure white cards
    primary: "w-full rounded-2xl border border-[#F2EAD8] bg-[#FAF6ED]/60 px-4 py-3.5 text-[#1E2923] placeholder-[#A0B0A6] outline-none transition-all duration-200 focus:border-[#4F8F6D] focus:bg-white focus:ring-4 focus:ring-[#2F6F4E]/10",
    search: "w-full rounded-2xl border border-[#F2EAD8] bg-[#FAF6ED]/50 px-5 py-3 text-[#1E2923] placeholder-[#A0B0A6] outline-none transition-all duration-200 focus:border-[#4F8F6D] focus:bg-white focus:ring-4 focus:ring-[#2F6F4E]/10",
    error: "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-500/10",
  },

  buttons: {
    // Swapped raw tailwind 'green-700' for your beautiful brand forestGreen tokens
    primary: "bg-[#2F6F4E] text-white font-medium px-6 py-3 rounded-2xl hover:bg-[#24563C] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200",
    secondary: "bg-[#CFE8F4] text-[#2C2C2C] font-medium px-6 py-3 rounded-2xl hover:bg-[#b5daf0] transition-all duration-200",
    gold: "bg-[#D4A857] text-white font-medium px-6 py-3 rounded-2xl hover:bg-[#c29646] shadow-md transition-all duration-200",
    outline: "border-2 border-[#2F6F4E] text-[#2F6F4E] font-medium px-6 py-3 rounded-2xl hover:bg-[#2F6F4E] hover:text-white transition-all duration-200",
    fullWidth: "w-full",
    fab: "fixed bottom-6 right-6 rounded-full px-6 py-4 bg-[#2F6F4E] text-white shadow-xl hover:bg-[#24563C] transition-all duration-200",
    danger: "bg-red-600 text-white font-medium px-6 py-3 rounded-2xl hover:bg-red-700 transition-all duration-200",
    primaryFull: "w-full bg-[#2F6F4E] text-white py-3.5 rounded-2xl font-semibold hover:bg-[#24563C] shadow-md hover:shadow-lg transition-all duration-300",
    loading: "opacity-60 cursor-not-allowed",
    icon: "w-10 h-10 flex items-center justify-center rounded-full text-[#526359] hover:bg-[#FAF6ED] hover:text-[#2F6F4E] transition-colors duration-200",
    primaryLarge: "bg-[#2F6F4E] text-white hover:bg-[#24563C] transition-all duration-300 rounded-2xl py-4 px-6 w-full font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5",
  },

  cards: {
    // Primary white components popping on the cream canvas layout
    trip: "bg-white rounded-3xl shadow-[0_8px_30px_rgb(47,111,78,0.04)] overflow-hidden",
    feature: "bg-white rounded-2xl shadow-[0_8px_30px_rgb(47,111,78,0.03)] p-5",
    glass: "bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/40",
    auth: "bg-white rounded-3xl shadow-[0_20px_50px_rgb(47,111,78,0.06)] p-8 border border-[#F2EAD8]/50",
    dashboardTrip: "bg-white rounded-3xl shadow-[0_8px_30px_rgb(47,111,78,0.04)] p-6 border border-[#F2EAD8]/30 hover:shadow-[0_12px_40px_rgb(47,111,78,0.08)] hover:-translate-y-1 transition-all duration-300",
    modal: "bg-white rounded-3xl shadow-[0_24px_60px_rgb(0,0,0,0.08)] p-8 border border-[#F2EAD8]/40",
    dashboardHero: "bg-gradient-to-br from-[#2F6F4E] to-[#4F8F6D] text-white rounded-3xl shadow-lg p-8 relative overflow-hidden",
    dashboardNavbar: "bg-white rounded-2xl shadow-[0_4px_20px_rgb(47,111,78,0.03)] px-6 py-4 border border-[#F2EAD8]/20",
    dashboardSection: "bg-white rounded-3xl shadow-[0_8px_30px_rgb(47,111,78,0.04)] p-6",
    authGlass: "bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/50",
    dropdown: "bg-white rounded-2xl shadow-xl border border-[#F2EAD8]/60 p-2",
    attentionPrimary: "bg-gradient-to-br from-[#2F6F4E] to-[#4F8F6D] text-white rounded-3xl shadow-xl p-8",
    attentionSecondary: "bg-white rounded-3xl shadow-[0_8px_30px_rgb(47,111,78,0.04)] p-8 border border-[#F2EAD8]/30",
    attentionEmpty: "bg-white rounded-3xl shadow-md p-8 text-center border border-dashed border-[#F2EAD8]",
    createJourney: "bg-white rounded-3xl shadow-2xl p-8",
    tripHero: "relative overflow-hidden rounded-3xl shadow-xl",
    tripOverview: "bg-white rounded-3xl shadow-md p-6",
    memberRow: "flex items-center justify-between p-4 rounded-2xl hover:bg-[#FAF6ED] transition-all duration-200 cursor-pointer",
    statCard: "bg-[#FAF6ED] rounded-2xl p-4 border border-[#F2EAD8]/40",
    memberAvatar: "w-12 h-12 rounded-full bg-[#2F6F4E] text-white flex items-center justify-center text-lg font-semibold",
    adminBadge: "px-2.5 py-1 rounded-full text-xs font-medium bg-[#FAF6ED] text-[#2F6F4E] border border-[#2F6F4E]/20",
    actionCard: "rounded-2xl border border-[#F2EAD8] p-4 bg-white hover:bg-[#FAF6ED] hover:border-[#4F8F6D]/30 transition-all duration-200 cursor-pointer",
    profileCard: "bg-[#FAF6ED] border border-[#F2EAD8]/60 rounded-3xl p-8 text-center shadow-sm",
    searchResult: "flex items-center justify-between p-4 rounded-2xl transition-all duration-200 hover:bg-[#FAF6ED]",
  },

  tabs: {
    trip: "flex gap-2 overflow-x-auto pb-2",
    tab: "px-5 py-2.5 rounded-xl font-medium transition-all duration-200 whitespace-nowrap text-sm",
    active: "bg-[#2F6F4E] text-white shadow-sm",
    inactive: "bg-[#FAF6ED] text-[#526359] hover:bg-[#F2EAD8] hover:text-[#1E2923]",
    tripSection: "bg-white rounded-3xl shadow-lg p-6",
    statMini: "bg-[#FAF6ED] rounded-xl p-3 border border-[#F2EAD8]/40",
  },

  gradients: {
    hero: "bg-gradient-to-br from-[#FAF6ED] via-[#F2EAD8] to-[#CFE8F4]",
    section: "bg-gradient-to-r from-[#FAF6ED] to-[#FFFFFF]",
  },

  animations: {
    fadeIn: "transition-opacity duration-300",
    slideUp: "transition-all duration-300",
    scaleIn: "transition-transform duration-300",
    hoverLift: "hover:-translate-y-1 hover:shadow-md transition-all duration-200",
    cardHover: "hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgb(47,111,78,0.08)] transition-all duration-300",
    tripHover: "hover:-translate-y-1 transition-all duration-300",
    imageZoom: "group-hover:scale-105 transition-transform duration-500",
    fadeUp: "animate-fadeIn",
    modal: "animate-in fade-in zoom-in-95 duration-200",
    drawer: "transition-transform duration-300 ease-out",
    drawerOpen: "translate-x-0 opacity-100",
    drawerClosed: "translate-x-full opacity-0",
    drawerTransition: "transition-all duration-300 ease-out",
  },

  tripLayouts: {
    overviewGrid: "grid grid-cols-1 xl:grid-cols-2 gap-6",
    statsGrid: "grid grid-cols-2 gap-4",
  },

  trip: {
    page: "space-y-6",
    hero: "relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2F6F4E] to-[#4F8F6D] text-white p-8 shadow-lg",
    contentGrid: "grid grid-cols-1 xl:grid-cols-2 gap-6",
  },

  backdrop: {
    modal: "fixed inset-0 bg-[#1E2923]/40 backdrop-blur-sm flex items-center justify-center z-50", // Changed overlay mask from stark pure black to branding deep forest charcoal
  },

  status: {
    upcoming: {
      bg: "bg-[#CFE8F4]/50",
      text: "text-[#2B617F]",
    },
    ongoing: {
      bg: "bg-[#FAF6ED]",
      text: "text-[#2F6F4E]",
    },
    completed: {
      bg: "bg-[#F2EAD8]/40",
      text: "#526359",
    },
  },

  badges: {
    admin: "bg-[#FAF6ED] text-[#2F6F4E] border border-[#2F6F4E]/20 font-medium px-2 py-0.5 rounded-md text-xs",
    creator: "bg-[#FAF6ED] text-[#D4A857] border border-[#D4A857]/20 font-medium px-2 py-0.5 rounded-md text-xs",
    member: "bg-[#CFE8F4]/40 text-[#2B617F] font-medium px-2 py-0.5 rounded-md text-xs",
    unread: "bg-red-50 text-red-700 font-medium px-2 py-0.5 rounded-md text-xs",
  },

  modals: {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
  },

  links: {
    auth: "text-[#2F6F4E] hover:text-[#24563C] font-semibold transition-colors duration-200",
  },

  navbar: {
    container: "bg-white rounded-2xl shadow-[0_4px_20px_rgb(47,111,78,0.02)] px-6 py-4 border border-[#F2EAD8]/20",
    icon: "w-10 h-10 rounded-full flex items-center justify-center text-[#526359] hover:bg-[#FAF6ED] hover:text-[#2F6F4E] transition-all duration-200",
  },

  dropdown: {
    item: "px-4 py-3 hover:bg-[#FAF6ED] text-[#526359] hover:text-[#1E2923] font-medium cursor-pointer transition-colors duration-150",
  },

  emptyState: {
    container: "bg-white rounded-3xl shadow-[0_8px_30px_rgb(47,111,78,0.03)] p-12 text-center border border-[#F2EAD8]/40",
  },

  sectionTitles: {
    dashboard: "text-2xl md:text-3xl font-bold text-[#2F6F4E]",
  },

  skeleton: {
    card: "animate-pulse bg-[#F2EAD8]/50 rounded-3xl",
    line: "animate-pulse bg-[#F2EAD8]/60 rounded-full",
    attention: "animate-pulse bg-white rounded-3xl shadow-xl p-8",
    trip: "animate-pulse bg-white rounded-3xl shadow-lg p-6",
  },

  drawer: {
    overlay: "fixed inset-0 bg-[#1E2923]/30 backdrop-blur-xs z-40",
    panel: "fixed top-0 right-0 h-full w-full md:w-[420px] lg:w-[460px] bg-white shadow-2xl p-6 overflow-y-auto border-l border-[#F2EAD8]/40",
    header: "flex items-center justify-between mb-8",
  },

  modalLayout: {
    searchResults: "max-h-[400px] overflow-y-auto space-y-2",
  },

  itinerary: {
    timeline: "relative pl-8",
    dayGroup: "mb-10",
    dayTitle: "text-xl font-bold text-[#2F6F4E] mb-2",
    eventLine: "absolute left-3 top-0 bottom-0 w-[2px] bg-[#EAE3D2]", // Swapped stark gray line for a muted sandalwood trace
    eventDot: "absolute left-0 top-6 w-6 h-6 rounded-full bg-[#2F6F4E] border-4 border-white shadow-sm",
  },
};