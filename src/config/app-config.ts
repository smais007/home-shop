import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Home Shoppers",
  version: packageJson.version,
  copyright: `© ${currentYear}, Home Shoppers.`,
  meta: {
    title: "Home Shoppers - বিশুদ্ধ ফোঁটা, নিখুঁত যত্ন যেটির উপর আপনি ভরসা করতে পারেন।",
    description:
      "আমাদের প্রিমিয়াম ন্যাচারাল হেয়ার অয়েল দিয়ে উপভোগ করুন বিশুদ্ধতা ও নিখুঁততার নিখুঁত ভারসাম্য। সহজ ব্যবহারযোগ্য ডিজাইন ও উন্নত মানের বোতল প্রতিটি ফোঁটা দেয় সঠিক পরিমাণে — কোনো অপচয় নয়, শুধু চুলের জন্য সর্বোচ্চ পুষ্টি ও যত্ন।.",
  },
};
