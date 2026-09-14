import { VolumeItem, AudioTrack, PodcastItem, CommunityPost } from '../types';

export const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyO1ta9zSEO0ft0QWIviLvr16_PKNJZzm86yXPUl0tWthPNcWUHT0wdP6SQJ9-DE4Tojw/exec";

export const rawLinks: string[] = [
  "https://drive.google.com/file/d/1DS92iGBd8GI4ZSKhkKVMuAlwBNdgnMfT/view?usp=drivesdk",
  "https://drive.google.com/file/d/1638kDq0hXXwjLPMozk1cAGt4qBSnk_xE/view?usp=drivesdk",
  "https://drive.google.com/file/d/1eQQmpzBSI9SMAYCtfHcaEt9i9VR2xpfA/view?usp=drivesdk",
  "https://drive.google.com/file/d/1lf1R3m57jzFU3auWxb18gAUEp3alsQDM/view?usp=drivesdk",
  "https://drive.google.com/file/d/1vmhk62t3952327GC8fRC40TUX_XqIQQT/view?usp=drivesdk",
  "https://drive.google.com/file/d/1m5fPwRDtD0eE4vWBpHqeHoRWpaHRWkLi/view?usp=drivesdk",
  "https://drive.google.com/file/d/1k67dmJXQDWaTGmF-Ad0ffYHtTVn5NqC0/view?usp=drivesdk",
  "https://drive.google.com/file/d/1sagLOlIrTHJSSRZHoHkB3CGOmqRsHesk/view?usp=drivesdk",
  "https://drive.google.com/file/d/1UpbGv2dcZM9qFPTo_dlSAiB60fDLj5dP/view?usp=drivesdk",
  "https://drive.google.com/file/d/1cR7FvuofyAw3PBvuI4wPTCZ6dEBEFdjQ/view?usp=drivesdk",
  "https://drive.google.com/file/d/1sFjBVFT4VnFsM-fzxmBUqx9iT96ramVC/view?usp=drivesdk",
  "https://drive.google.com/file/d/1KzPXthAWXOMBlTIqmP3N8hIeleScYXTn/view?usp=drivesdk",
  "https://drive.google.com/file/d/1UDt_Ss4ZnyS6I9A8GbxpX8rpDIl9QiYK/view?usp=drivesdk",
  "https://drive.google.com/file/d/14GfX0djPOAaxfl4WNThnQ6Vv9ZzQBQxp/view?usp=drivesdk",
  "https://drive.google.com/file/d/1zNj800FQArrtL-P27KFfL0jTPGVeqQLP/view?usp=drivesdk",
  "https://drive.google.com/file/d/1MmzizY6xg84V_Se1F7SsPfCzoIeECzLq/view?usp=drivesdk",
  "https://drive.google.com/file/d/1KcRsUSnS_rUSz4MSj2921MARRpUkNcsm/view?usp=drivesdk",
  "https://drive.google.com/file/d/1ZHaOi6yZtPBKBUDD4u5LKfH-euDOwvfd/view?usp=drivesdk",
  "https://drive.google.com/file/d/1UDQ2m7XwgltASrO8qM0JVzbO4E4XYyw1/view?usp=drivesdk",
  "https://drive.google.com/file/d/1tOLKO0HNmAa4MzDZPv2r4Q_BmEw_LsPw/view?usp=drivesdk",
  "https://drive.google.com/file/d/1CiwzHnuGX6asG5z3IRvqNiHUPqpcvFnH/view?usp=drivesdk",
  "https://drive.google.com/file/d/1dcixOg41U3waIoy7Epuvaw8t4OOY5S4A/view?usp=drivesdk",
  "https://drive.google.com/file/d/1Qyx4mGQK833evtnqK649ziMEMH7U39PG/view?usp=drivesdk",
  "https://drive.google.com/file/d/1chtA9Hp7UgUVsfHfdihyhjqZzSNLu2s_/view?usp=drivesdk",
  "https://drive.google.com/file/d/1kb0fw5yXBP7uZuiy-gEj18Ct0kEeye-d/view?usp=drivesdk",
  "https://drive.google.com/file/d/17glsqiMEhz4QZFKMhaYIXHw6B_yCS3Rn/view?usp=drivesdk",
  "https://drive.google.com/file/d/1I6_7NNxWDeFho4MHY3gvyPURaNTT9JQI/view?usp=drivesdk",
  "https://drive.google.com/file/d/1JprJquzq7bmBFC5lCIwebc9rH7aVR3Or/view?usp=drivesdk",
  "https://drive.google.com/file/d/1IX_X20BpfI_6RIJ_txCs0ZTl8370oSGB/view?usp=drivesdk",
  "https://drive.google.com/file/d/1CY370T9OSgZlqJn2znmpZiivABLtBXR7/view?usp=drivesdk",
  "https://drive.google.com/file/d/15qJr5WEq2_Hb6AZh7f47GofHazNwGGqj/view?usp=drivesdk",
  "https://drive.google.com/file/d/14TTYXHSRsBeFmgtT63SDQcRTMmnonAWT/view?usp=drivesdk",
  "https://drive.google.com/file/d/1PMAQZPLsYwtAgrLHV7HXoGgc3zcBU5Aw/view?usp=drivesdk",
  "https://drive.google.com/file/d/1JC6jfY3sk5In2EUWeB5m6v4a2opuZiQD/view?usp=drivesdk",
  "https://drive.google.com/file/d/1Yiz_yOtFNvJYbhNclIBGCC4NvXdlZLmz/view?usp=drivesdk",
  "https://drive.google.com/file/d/1E2APLRr1Tm1pag0EZdbZIRAmOY7nbIgB/view?usp=drivesdk",
  "https://drive.google.com/file/d/169SjaiPXgBdBWsg1cEUZ-lR4O-yMpaVh/view?usp=drivesdk",
  "https://drive.google.com/file/d/1PXnxAhrbngagFFZVkRalGvSeKfNHYd1i/view?usp=drivesdk",
  "https://drive.google.com/file/d/1MOfGC_c0XQTd3qQdPKXOaEpIfuzxq-U5/view?usp=drivesdk",
  "https://drive.google.com/file/d/1GyVl8iq26-PocVA7uNQGTp0Z_XZ8s9dh/view?usp=drivesdk",
  "https://drive.google.com/file/d/1E0i4MRhwmFnKzdH0qlyQsjq3yqMzyvcY/view?usp=drivesdk",
  "https://drive.google.com/file/d/1Z9E731FVCY_SW5-PS0KyC4hWearJDeC2/view?usp=drivesdk",
  "https://drive.google.com/file/d/1X08279nx9-L39uoQ6iaBwUoQRqYZIpl5/view?usp=drivesdk",
  "https://drive.google.com/file/d/1_cEe2Ydlaw00WaewmOsV5ou_0k3RCPXl/view?usp=drivesdk",
  "https://drive.google.com/file/d/1ZGy1eDJGgKICw_08rKAwgjOm1YVN7hzA/view?usp=drivesdk",
];

export const rawDescriptions: string[] = [
  "มหาวิภังค์ ภาค 1 - ปาราชิก สังฆาทิเสส",
  "มหาวิภังค์ ภาค 2 - นิสสัคคิยปาจิตตีย์",
  "ภิกขุนีวิภังค์ - สิกขาบทภิกษุณี",
  "มหาวรรค ภาค 1 - อุปสมบท อุโบสถ",
  "มหาวรรค ภาค 2 - เครื่องหนัง เภสัช กฐิน",
  "จูฬวรรค ภาค 1 - กรรม สังฆเภท",
  "จูฬวรรค ภาค 2 - เสนาสนะ สังฆกรรม",
  "ปริวาร - ข้อปลีกย่อยพระวินัย",
  "สีลขันธวรรค - ศีลและจริยวัตร",
  "มหาวรรค - พระสูตรยาว 10 สูตร",
  "ปาฏิกวรรค - พระสูตรเบ็ดเตล็ด",
  "มัชฌิมนิกาย มูลปัณณาสก์",
  "มัชฌิมนิกาย มัชฌิมปัณณาสก์",
  "มัชฌิมนิกาย อุปริปัณณาสก์",
  "สังยุตตนิกาย สคาถวรรค",
  "สังยุตตนิกาย นิทานวรรค",
  "สังยุตตนิกาย ขันธวารวรรค",
  "สังยุตตนิกาย สฬายตนวรรค",
  "สังยุตตนิกาย มหาวารวรรค",
  "อังคุตตรนิกาย เอก-ทุก-ติกนิบาต",
  "อังคุตตรนิกาย จตุกกนิบาต",
  "อังคุตตรนิกาย ปัญจก-ฉักกนิบาต",
  "อังคุตตรนิกาย สัตตก-อัฏฐก-นวกนิบาต",
  "อังคุตตรนิกาย ทสก-เอกาทสกนิบาต",
  "ขุททกนิกาย ภาค 1 - คาถาธรรมบท",
  "ขุททกนิกาย ภาค 2 - รวมชาดก",
  "ขุททกนิกาย ภาค 3 - รวมชาดก",
  "ขุททกนิกาย ภาค 4 - รวมชาดก",
  "ขุททกนิกาย ภาค 5 - รวมชาดก",
  "ขุททกนิกาย ภาค 6 - รวมชาดก",
  "ขุททกนิกาย ภาค 7 - รวมชาดก",
  "ขุททกนิกาย ภาค 8 - รวมชาดก",
  "ขุททกนิกาย ภาค 9 - รวมชาดก",
  "ธัมมสังคณีปกรณ์",
  "วิภังคปกรณ์",
  "ธาตุกถา-ปุคคลบัญญัติปกรณ์",
  "กถาวัตถุปกรณ์",
  "ยมกปกรณ์ ภาค 1",
  "ยมกปกรณ์ ภาค 2",
  "ยมกปกรณ์ ภาค 3",
  "ปัฏฐานปกรณ์ ภาค 1",
  "ปัฏฐานปกรณ์ ภาค 2",
  "ปัฏฐานปกรณ์ ภาค 3",
  "ปัฏฐานปกรณ์ ภาค 4",
  "ปัฏฐานปกรณ์ ภาค 5",
];

export function toThaiDigits(num: number): string {
  const thaiNums = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
  return num
    .toString()
    .split('')
    .map((d) => thaiNums[parseInt(d, 10)] || d)
    .join('');
}

export function extractDriveId(url: string): string {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : '';
}

export const TIPITAKA_VOLUMES: VolumeItem[] = Array.from({ length: 45 }, (_, i) => {
  const num = i + 1;
  let catKey: 'vinaya' | 'sutta' | 'abhidhamma' = 'vinaya';
  let catLabel = 'พระวินัย';
  let tagBg = 'bg-amber-50 text-amber-900 border-amber-300';

  if (num > 8 && num <= 33) {
    catKey = 'sutta';
    catLabel = 'พระสูตร';
    tagBg = 'bg-blue-50 text-blue-900 border-blue-300';
  } else if (num > 33) {
    catKey = 'abhidhamma';
    catLabel = 'พระอภิธรรม';
    tagBg = 'bg-emerald-50 text-emerald-900 border-emerald-300';
  }

  const link = rawLinks[i];
  const driveFileId = extractDriveId(link);

  return {
    n: num,
    thaiN: toThaiDigits(num),
    catKey,
    catLabel,
    tagBg,
    link,
    driveFileId,
    desc: rawDescriptions[i],
  };
});

export const AUDIO_LIST: AudioTrack[] = [
  {
    title: "เสียงอ่านพระไตรปิฎก เล่มที่ ๑ มหาวิภังค์",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    title: "บทสวดมนต์ทำวัตรเช้า-เย็น และพระสูตรสำคัญ",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    title: "เสียงอ่าน อริยสัจ ๔ และมรรคมีองค์ ๘",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];

export const PODCAST_LIST: PodcastItem[] = [
  {
    ytId: "S-J3fJbE-Yk",
    title: "สรุปพระไตรปิฎก ๔๕ เล่ม ครบถ้วนเข้าใจง่าย",
    desc: "บรรยายภาพรวมโครงสร้างพระธรรมวินัย พระวินัย พระสูตร และพระอภิธรรม",
  },
  {
    ytId: "g4YpIeS2RVs",
    title: "พอดแคสต์ฟังธรรมก่อนนอน - อริยสัจ ๔ และมรรคมีองค์ ๘",
    desc: "หลักธรรมเพื่อการดับทุกข์และสร้างความสงบใจในชีวิตประจำวัน",
  },
  {
    ytId: "9Sgl34W4GqI",
    title: "สรุปสาระสำคัญ พระวินัยปิฎก (เล่ม ๑ - ๘)",
    desc: "ศึกษาโครงสร้างศีล ๒๒๗ ข้อ และสิกขาบทของพระภิกษุและภิกษุณี",
  },
  {
    ytId: "Qp4uW2l2mP0",
    title: "สรุปสาระสำคัญ พระสุตตันตปิฎก (เล่ม ๙ - ๓๓)",
    desc: "บทสรุปพระสูตรสำคัญ ชาดก คาถาธรรมบท และชาดกสอนใจ",
  },
  {
    ytId: "7O0P3sXn7Xw",
    title: "สรุปสาระสำคัญ พระอภิธรรมปิฎก (เล่ม ๓๔ - ๔๕)",
    desc: "คำสอนว่าด้วยปรมัตถธรรม จิต เจตสิก รูป นิพพาน",
  },
];

export const SAMPLE_POSTS: CommunityPost[] = [
  {
    id: 'sample-1',
    date: '14/9/2569 09:30',
    author: 'พระอาจารย์ธัมมปาโล',
    category: 'ข้อคิดธรรมะประจำวัน',
    title: 'การมีสติอยู่กับลมหายใจ (อานาปานสติ)',
    content: 'การฝึกสติรับรู้ลมหายใจเข้าและออก ช่วยให้จิตใจสงบและไม่ฟุ้งซ่านไปตามอารมณ์ภายนอก ลองฝึกทำวันละ 10-15 นาทีในชีวิตประจำวัน',
    replies: [
      {
        id: 'rep-1',
        date: '14/9/2569 10:15',
        author: 'อุบาสกใจดี',
        content: 'สาธุครับ ฝึกสติระหว่างวันแล้วรู้สึกใจเย็นลงเยอะเลยครับ',
      },
    ],
  },
  {
    id: 'sample-2',
    date: '14/9/2569 11:20',
    author: 'อุบาสกผู้ใฝ่ธรรม',
    category: 'ถาม-ตอบ ปัญหาธรรม',
    title: 'สอบถามเรื่องการปฏิบัติธรรมในชีวิตประจำวัน',
    content: 'ทำงานออฟฟิศยุ่งตลอดทั้งวัน สามารถเจริญสติระหว่างการทำงานได้อย่างไรบ้างครับ?',
    replies: [
      {
        id: 'rep-2',
        date: '14/9/2569 12:00',
        author: 'พระสมชาย',
        content: 'สามารถฝึกรู้กายรู้ใจในขณะทำงานได้เลย เช่น ขณะพิมพ์งาน รู้สึกถึงสัมผัสนิ้ว หรือระลึกรู้สภาวะอารมณ์ที่เกิดขึ้นโดยไม่ยินดียินร้าย',
      },
    ],
  },
];
