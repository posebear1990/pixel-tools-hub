window.PIXEL_HOME = {
  header: {
    title: "Xiaoxiong Apps",
    subtitle: "Small apps, tools and experiments by Xiaoxiong.",
  },
  featured: ["xgp-box", "breathe-ball"],
  sections: [
    {
      id: "tools",
      title: "Tools",
      tone: "tools",
      items: [
        "xgp-box",
        "breathe-ball",
        "twotwo-girl",
        "twitter-translator",
        "anki-learning-by-list",
      ],
    },
    {
      id: "content",
      title: "Content",
      tone: "content",
      items: ["daily", "podcast"],
    },
  ],
  apps: [
    {
      id: "twitter-translator",
      name: "Xwitter Translator Bear",
      shortDesc: "A Chrome extension for inline X/Twitter translation.",
      longDesc:
        "Translate X (Twitter) posts in one click using Google, Baidu, or your own LLM API keys.",
      tags: ["Tool", "Browser Extension"],
      href: "https://chromewebstore.google.com/detail/xwitter-translator-bear-x/jfoppggphfkahfohdamcijagmpgffenp",
      iconSrc: "./assets/icons/xwitter-translator-bear.png",
      fallback: "TW",
      theme: "sunset",
    },
    {
      id: "twotwo-girl",
      name: "22 Girl Danmaku Adventure",
      shortDesc:
        "A Chrome extension to turn Bilibili live danmaku into platforms.",
      longDesc:
        "Convert real-time Bilibili live stream danmaku into jumping platforms for a 22-Niang pixel mini-game.",
      tags: ["Tool", "Game"],
      href: "https://chromewebstore.google.com/detail/22%E5%A8%98%E5%BC%B9%E5%B9%95%E5%A4%A7%E5%86%92%E9%99%A9/ffipgjffmghinekaaolhingoncpnenol",
      iconSrc: "./assets/icons/twotwo-girl.png",
      iconFit: "cover",
      fallback: "22",
      theme: "leaf",
    },
    {
      id: "breathe-ball",
      name: "Breathe Ball",
      shortDesc: "A minimalist guided breathing tool.",
      longDesc:
        "A simple breathing visualizer with custom rhythm presets to help you focus and relax.",
      tags: ["Tool", "Wellness"],
      href: "https://breatheball.xiaoxiong.app/",
      iconSrc: "./assets/icons/breatheball.png",
      iconFit: "cover",
      fallback: "BR",
      theme: "sky",
      featuredLabel: "Featured Tool",
    },
    {
      id: "xgp-box",
      name: "Game Pass Box",
      shortDesc:
        "A tool to help Xbox Game Pass users discover their next game.",
      longDesc:
        "Discover what is actually worth playing next on Xbox Game Pass based on community ratings and value metrics.",
      tags: ["Tool", "Game"],
      href: "https://gpbox.xiaoxiong.app/",
      iconSrc: "./assets/icons/game-pass-box.png",
      fallback: "XB",
      theme: "gold",
      featuredLabel: "Featured Tool",
    },
    {
      id: "daily",
      name: "Daily",
      shortDesc: "My personal blog and reading notes.",
      longDesc:
        "A collection of my personal essays, technical notes, book reviews, and daily reflections.",
      tags: ["Content", "Writing"],
      href: "https://daily.xiaoxiong.app/",
      iconSrc: "./assets/icons/daily-favicon.ico",
      fallback: "DY",
      theme: "coral",
    },
    {
      id: "podcast",
      name: "Learn English with Podcasts",
      shortDesc: "An AI-assisted English learning podcast.",
      longDesc:
        "An English learning podcast utilizing AI semantic analysis to split episodes into five-minute segments with automatic Chinese summaries.",
      tags: ["Content", "Audio"],
      href: "https://enpod.podcast.xyz/",
      iconSrc: "./assets/icons/podcast-english.jpg",
      iconFit: "cover",
      fallback: "PC",
      theme: "mint",
    },
    {
      id: "anki-learning-by-list",
      name: "Learning by List",
      shortDesc: "An Anki add-on to view cards as table lists.",
      longDesc:
        "An Anki add-on that displays your cards as spreadsheet-style lists with custom columns and inline audio.",
      tags: ["Tool", "Study"],
      href: "https://ankiweb.net/shared/info/884041405",
      iconSrc: "./assets/icons/book-list.svg",
      fallback: "AL",
      theme: "violet",
    },
  ],
};
