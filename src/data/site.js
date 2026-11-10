import { V } from './videos.js'

export const CONTACT = {
  address:
    'Plot# 798- 799, Golden Block, Dua Greens, Ali Raza Jhokio Goth, Gadap, District Malir, Karachi, Pakistan.',
  phone: '+92 324 8285533',
  phoneHref: 'tel:+923248285533',
  email: 'dairy@bholufarms.com',
  emailHref: 'mailto:dairy@bholufarms.com',
  whatsapp: 'https://wa.me/923248285533',
  facebook:
    'https://www.facebook.com/people/Bholu-Farms/61550891940668/?mibextid=wwXIfr&rdid=wNePxqSdHnLWI8Uy&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18kp7o7hE5%2F%3Fmibextid%3DwwXIfr',
  instagram:
    'https://www.instagram.com/bholudairyfarm?igsh=MW9rcnY5ZDFkaHFjcg%3D%3D&utm_source=qr',
  youtube: 'https://youtube.com/@bholudairymilk?si=6lnB_cxQUSPRb-s7',
  tagline:
    'Embrace your day with confidence, follow your own path, and shine bright with Bholu’ tips and tricks to make motherhood stress-free.',
}

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Shop', to: '/shop' },
  {
    label: 'News & Media',
    children: [
      { label: 'Recipes', to: '/recipes' },
      { label: 'Articles', to: '/articles' },
    ],
  },
  { label: 'Contact Us', to: '/contact' },
]

export const FOOTER_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Product', to: '/shop' },
  { label: 'News & Media', to: '/recipes' },
  { label: 'Contact Us', to: '/contact' },
]

export const FEED_PARAGRAPHS = [
  'For generations Bholu Cattle and Dairy Farms has been a name synonym to trust, quality and nourishment.',
  'From Cattle Feed to the glass of milk at your table, every part of the process is managed and taken care of, under the supervision of professionally trained and fully equipped staff.',
  'Free from artificial hormones and boosters, fed with farm grown feed, and carefully chosen ingredients, at Bholu Cattle Farms, HF Cows produce milk naturally through uncompromised nutrition and care.',
]

export const FRESH_MILK_PARAGRAPHS = [
  'At Bholu Farm, we deliver 100% organic milk sourced daily from our carefully managed herd. Every batch is processed through closed, automated milking systems to maintain hygiene and preserve natural quality from farm to home.',
  'By maintaining well supervised control over feed and animal care, with a strict no-added-hormones and no-added-preservatives policy. The result is fresh, thick milk naturally rich in protein, calcium and essential nutrients delivered to your doorstep within hours of milking.',
]

export const PRODUCT_PARAGRAPHS = [
  'Our Products are made from 100% pure milk sourced daily from our own farm. Every product is processed and packaged in a closed, hygienic system to lock in freshness and preserve natural nutrients and taste.',
  'From milking to delivery, we maintain strict quality control at every step of the process. Resulting in fresh dairy that reaches your doorstep everyday.',
]

export const PRODUCTS = [
  {
    id: 'bholu-milk-1l',
    name: 'Bholu Pure Cow Milk (1 Litre)',
    category: 'Fresh Milk',
    price: 260,
    image: '/images/product.jpeg',
    thumb: '/images/product-600.jpeg',
    badge: '100% Organic',
    tags: ['No Growth Hormones', 'Automatic Milking', 'Farm Fresh'],
  },
]

export const RECIPES = [
  {
    title: 'Traditional Serving Style',
    image: '/images/recipe-1.jpeg',
    video: V.stir,
    excerpt:
      'Serve fresh farm milk the traditional way — chilled, creamy and poured with love for the whole family.',
  },
  {
    title: 'Milk Preparation (Fresh Farm Milk)',
    image: '/images/recipe-2.jpeg',
    video: V.pour1080,
    excerpt:
      'What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the',
  },
  {
    title: 'Final Kheer Presentation',
    image: '/images/recipe-3.jpeg',
    video: V.pudding,
    excerpt:
      'A rich and creamy rice kheer finished with Bholu farm fresh milk, dry fruits and a golden glow.',
  },
  {
    title: 'Cooking Rice Kheer',
    image: '/images/recipe-4.jpeg',
    excerpt:
      'Slow-cooked rice kheer prepared in pure Bholu milk for that authentic, wholesome homemade taste.',
  },
]

export const ARTICLES = [
  {
    title: 'Milk and Better Sleep: Can Dairy Really Help You Rest?',
    image: '/images/article-1.jpg',
    excerpt:
      'What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the',
  },
  {
    title: 'Milk and Better Sleep: Can Dairy Really Help You Rest?',
    image: '/images/article-2.jpg',
    excerpt:
      'What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the',
  },
  {
    title: 'Milk and Better Sleep: Can Dairy Really Help You Rest?',
    image: '/images/article-3.webp',
    excerpt:
      'What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the',
  },
  {
    title: 'Milk and Better Sleep: Can Dairy Really Help You Rest?',
    image: '/images/article-4.webp',
    excerpt:
      'What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the',
  },
]

export const PROCESS = [
  {
    title: 'Organic Feeding',
    image: '/images/process-organic.jpeg',
    video: V.dew,
    text: 'Our cattle graze freely on premium, organic green pastures and nutrient-rich, chemical-free fodder to ensure natural quality.',
    icon: '🌿',
  },
  {
    title: 'Stress-Free Environment',
    image: '/images/process-stress-free.jpeg',
    video: V.barn,
    text: 'We maintain a comfortable, climate-controlled, and completely stress-free environment for our herd, ensuring optimal animal welfare.',
    icon: '🐄',
  },
  {
    title: 'State of the Art Processing',
    image: '/images/process-processing.jpeg',
    video: V.conveyor,
    text: 'Utilizing advanced, automated, and touchless milk processing technology to seal in freshness and maximum hygiene.',
    icon: '⚙️',
  },
]

export const ABOUT_PARAGRAPHS = [
  'Our roots run deep into the heart of traditional dairy farming. What started as a dedicated family initiative to preserve the true taste and nutrition of fresh milk has now grown into a modern, state-of-the-art ecosystem.',
  'We have blended time-honored farming values with cutting-edge quality control to fulfill the promise, where every drop produced at our farms remains untamed, purified and purely wholesome.',
  'Our commitment goes beyond just business, it’s promise of health and nourishment to your family. By feeding our cattle on chemical-free feed and sheltering them in a stress-free environment, ensuring that the milk naturally preserves its essential vitamins and rich taste.',
  'Today while maintaining the heritage of traditional rural practices of farming, we deliver freshly produced and organic milk to your urban doorsteps, delivering wellness daily, with transparency and care.',
]

export const CONTACT_PARAGRAPHS = [
  'Our roots run deep into the heart of traditional dairy farming. What started as a dedicated family initiative to preserve the true taste and nutrition of fresh milk has evolved into a modern, state-of-the-art ecosystem. We have blended time-honored farming values with cutting-edge quality control to ensure every drop we produce remains untamed, unadulterated, and perfectly wholesome.',
  'Our commitment goes beyond just business; it is a promise of health to your family. By feeding our cattle on chemical-free pastures and keeping them in a stress-free environment, we ensure that the milk naturally retains its vital vitamins and rich taste, just as nature intended.',
]

export const AREAS = [
  'Clifton', 'Defence (DHA)', 'Saddar', 'Gulshan-e-Iqbal', 'North Nazimabad',
  'Federal B Area', 'Gulistan-e-Johar', 'Malir', 'Korangi', 'Landhi',
  'Shah Faisal', 'Liaquatabad', 'Nazimabad', 'Orangi Town', 'Lyari',
  'SITE Area', 'Baldia Town', 'Kemari', 'Bin Qasim', 'Gadap Town',
  'New Karachi', 'Surjani Town', 'Scheme 33', 'Buffer Zone', 'Bahadurabad',
  'PECHS', 'Tariq Road', 'Baharia Town Karachi', 'Saadi Town', 'North Karachi',
  'Garden', 'Jamshed Town', 'Gulberg Town', 'Sohrab Goth', 'Johar Mor',
  'Cantt', 'Manzoor Colony', 'Nazimabad No. 1', 'Nazimabad No. 2', 'Nazimabad No. 3',
  'Nazimabad No. 4', 'Nazimabad No. 5', 'Paposh Nagar', 'Hyderi', 'Ayesha Manzil',
  'Shadman Town', 'Karsaz', 'Model Colony', 'Airport Area', 'Tipu Sultan',
  'Shahrah-e-Faisal', 'Burns Road', 'Boat Basin', 'Khayaban-e-Ittehad', 'Seaview',
]

export const STATS = [
  { value: 100, suffix: '%', label: 'Organic & Pure' },
  { value: 0, suffix: '', label: 'Added Hormones' },
  { value: 24, suffix: '/7', label: 'Farm Care' },
  { value: 1000, suffix: '+', label: 'Happy Families' },
]

export const STRIP_ITEMS = [
  '100% Organic Milk',
  'No Growth Hormones',
  'Farm Fresh Daily',
  'Automatic Milking',
  'Pure • Fresh • Healthy',
  'Dairy Cows',
  'Free Home Delivery',
]
