// Sample copy for the preview demos. All businesses are fictional.

export type PreviewLocale = 'en' | 'ka';

export interface LandingContent {
    brand: string;
    navCta: string;
    badge: string;
    title: string;
    subtitle: string;
    cta: string;
    stats: Array<{ value: string; label: string }>;
    scheduleTitle: string;
    schedule: Array<{ time: string; name: string; coach: string }>;
    benefitsTitle: string;
    benefits: Array<{ title: string; text: string }>;
    quote: string;
    quoteAuthor: string;
    formTitle: string;
    formText: string;
    nameLabel: string;
    phoneLabel: string;
    classLabel: string;
    submit: string;
    successTitle: string;
    successText: string;
    again: string;
    footer: string;
}

export type BusinessPage = 'home' | 'services' | 'about' | 'contact';

export interface BusinessContent {
    brand: string;
    nav: Record<BusinessPage, string>;
    menuLabel: string;
    phone: string;
    home: {
        badge: string;
        title: string;
        subtitle: string;
        cta: string;
        secondary: string;
        cardLabel: string;
        cardValue: string;
        cardCta: string;
        highlights: Array<{ title: string; text: string }>;
        servicesTitle: string;
        allServices: string;
    };
    services: {
        title: string;
        subtitle: string;
        items: Array<{ name: string; text: string; price: string }>;
    };
    about: {
        title: string;
        text: string;
        stats: Array<{ value: string; label: string }>;
        teamTitle: string;
        team: Array<{ name: string; role: string }>;
    };
    contact: {
        title: string;
        subtitle: string;
        addressLabel: string;
        address: string;
        hoursLabel: string;
        hours: string;
        phoneLabel: string;
        formTitle: string;
        nameLabel: string;
        phoneFieldLabel: string;
        messageLabel: string;
        submit: string;
        successTitle: string;
        successText: string;
    };
    footer: string;
}

export type ProductCategory = 'cups' | 'plates' | 'vases';

export interface EcommerceContent {
    brand: string;
    searchPlaceholder: string;
    cartLabel: string;
    heroTitle: string;
    heroText: string;
    categories: Record<'all' | ProductCategory, string>;
    // Aligned by index with `products` in EcommerceDemo.vue.
    products: Array<{ name: string; price: number; badge?: string }>;
    currency: { prefix: string; suffix: string };
    add: string;
    added: string;
    empty: string;
    cartTitle: string;
    cartEmpty: string;
    subtotal: string;
    shipping: string;
    shippingValue: string;
    checkout: string;
    remove: string;
    close: string;
    orderTitle: string;
    orderText: string;
    keepShopping: string;
    footer: string;
}

export type BookingStatus = 'confirmed' | 'pending' | 'cancelled';
export type WebappView = 'dashboard' | 'bookings' | 'customers';

export interface WebappContent {
    brand: string;
    nav: Record<WebappView, string>;
    user: string;
    dashboard: {
        greeting: string;
        stats: Array<{ label: string; value: string; delta: string; up: boolean }>;
        chartTitle: string;
        week: string;
        month: string;
        weekLabels: string[];
        weekData: number[];
        monthLabels: string[];
        monthData: number[];
        todayTitle: string;
    };
    bookings: {
        newBooking: string;
        filters: Record<'all' | BookingStatus, string>;
        columns: { customer: string; service: string; time: string; status: string };
        rows: Array<{ customer: string; service: string; time: string; status: BookingStatus }>;
        newRow: { customer: string; service: string };
        statusHint: string;
        empty: string;
    };
    statuses: Record<BookingStatus, string>;
    customers: {
        searchPlaceholder: string;
        visits: string;
        spent: string;
        rows: Array<{ name: string; visits: number; spent: string }>;
        empty: string;
    };
}

export interface PreviewContent {
    landing: LandingContent;
    business: BusinessContent;
    ecommerce: EcommerceContent;
    webapp: WebappContent;
}

const en: PreviewContent = {
    landing: {
        brand: 'Pulse',
        navCta: 'Free trial',
        badge: 'New members: first week free',
        title: 'Get stronger in 30 minutes a day',
        subtitle: 'Small group training with a coach who knows your name. No contracts, no crowded gym floor.',
        cta: 'Book my free week',
        stats: [
            { value: '40+', label: 'classes a week' },
            { value: '12', label: 'coaches' },
            { value: '4.9', label: 'member rating' },
        ],
        scheduleTitle: "Today's classes",
        schedule: [
            { time: '07:30', name: 'Morning Strength', coach: 'with Nika' },
            { time: '12:15', name: 'Lunch HIIT', coach: 'with Ana' },
            { time: '19:00', name: 'Mobility Flow', coach: 'with Luka' },
        ],
        benefitsTitle: 'Why members stay',
        benefits: [
            { title: 'Short sessions', text: '30 focused minutes that fit before work or at lunch.' },
            { title: 'Real coaching', text: 'Groups of eight at most, so your form gets attention.' },
            { title: 'Flexible plans', text: 'Pause or cancel anytime, straight from your phone.' },
        ],
        quote: 'I came for the free week and stayed for a year. It is the first gym I actually look forward to.',
        quoteAuthor: 'Mariam, member since 2025',
        formTitle: 'Start with a free week',
        formText: "Leave your details and we'll call to pick your first class.",
        nameLabel: 'Your name',
        phoneLabel: 'Phone number',
        classLabel: 'Preferred class',
        submit: 'Book my free week',
        successTitle: "You're in, {name}!",
        successText: "We'll call you today to confirm your first class.",
        again: 'Book another',
        footer: '© Pulse Studio · sample landing page',
    },
    business: {
        brand: 'Mira Dental',
        nav: { home: 'Home', services: 'Services', about: 'About', contact: 'Contact' },
        menuLabel: 'Menu',
        phone: '+995 5XX XX XX XX',
        home: {
            badge: 'Family dentistry in Tbilisi',
            title: 'A calmer visit to the dentist',
            subtitle: 'Modern care for adults and children, with clear prices and appointments that start on time.',
            cta: 'Book a visit',
            secondary: 'Our services',
            cardLabel: 'Next available',
            cardValue: 'Today, 15:30',
            cardCta: 'Reserve',
            highlights: [
                { title: 'Same-week appointments', text: 'Most new patients are seen within three days.' },
                { title: 'Clear prices', text: 'You get a written treatment plan before anything starts.' },
                { title: 'Gentle with kids', text: "A dedicated children's dentist and a waiting room they like." },
            ],
            servicesTitle: 'Popular services',
            allServices: 'All services',
        },
        services: {
            title: 'Services',
            subtitle: 'Everything from a routine check-up to a full smile restoration.',
            items: [
                { name: 'Check-up & cleaning', text: 'Exam, professional cleaning and advice.', price: 'from $30' },
                { name: 'Fillings', text: 'Tooth-coloured fillings in one visit.', price: 'from $45' },
                { name: 'Teeth whitening', text: 'Safe in-clinic whitening.', price: 'from $120' },
                { name: 'Braces & aligners', text: 'Straighter teeth at any age.', price: 'from $900' },
                { name: 'Implants', text: 'A lasting replacement for a missing tooth.', price: 'from $650' },
                { name: "Children's dentistry", text: 'Patient care for the youngest patients.', price: 'from $25' },
            ],
        },
        about: {
            title: 'About the clinic',
            text: 'Mira Dental opened in 2014 with one chair and one rule: explain everything. Today a team of nine looks after more than 4,000 patients a year.',
            stats: [
                { value: '12', label: 'years in practice' },
                { value: '4,000+', label: 'patients a year' },
                { value: '9', label: 'specialists' },
            ],
            teamTitle: 'Meet the team',
            team: [
                { name: 'Dr. Nino K.', role: 'Lead dentist' },
                { name: 'Dr. Giorgi M.', role: 'Orthodontist' },
                { name: 'Dr. Salome T.', role: "Children's dentist" },
            ],
        },
        contact: {
            title: 'Contact',
            subtitle: "Call us or leave a request and we'll get back to you the same day.",
            addressLabel: 'Address',
            address: '12 Sample Street, Tbilisi',
            hoursLabel: 'Opening hours',
            hours: 'Mon–Sat, 10:00–19:00',
            phoneLabel: 'Phone',
            formTitle: 'Request an appointment',
            nameLabel: 'Your name',
            phoneFieldLabel: 'Phone number',
            messageLabel: 'What can we help with?',
            submit: 'Send request',
            successTitle: 'Request sent',
            successText: "Thank you, {name}. We'll call you back today.",
        },
        footer: '© Mira Dental · sample business website',
    },
    ecommerce: {
        brand: 'Tela',
        searchPlaceholder: 'Search ceramics…',
        cartLabel: 'Cart',
        heroTitle: 'Handmade ceramics for everyday tables',
        heroText: 'Small batches, thrown and glazed in Tbilisi. Free delivery on every order.',
        categories: { all: 'All', cups: 'Cups', plates: 'Plates & bowls', vases: 'Vases' },
        products: [
            { name: 'Speckled Mug', price: 18, badge: 'Bestseller' },
            { name: 'Dinner Plate', price: 22 },
            { name: 'Bud Vase', price: 28 },
            { name: 'Breakfast Bowl', price: 16 },
            { name: 'Espresso Cup Set', price: 24 },
            { name: 'Tall Vase', price: 46, badge: 'New' },
            { name: 'Serving Platter', price: 38 },
            { name: 'Tea Cup', price: 14 },
        ],
        currency: { prefix: '$', suffix: '' },
        add: 'Add to cart',
        added: 'Added',
        empty: 'No products found',
        cartTitle: 'Your cart',
        cartEmpty: 'Your cart is empty',
        subtotal: 'Subtotal',
        shipping: 'Delivery',
        shippingValue: 'Free',
        checkout: 'Checkout',
        remove: 'Remove',
        close: 'Close cart',
        orderTitle: 'Order placed',
        orderText: 'This is a demo, so nothing was charged. In a real store, online payment happens here.',
        keepShopping: 'Keep shopping',
        footer: '© Tela Ceramics · sample online store',
    },
    webapp: {
        brand: 'Deskly',
        nav: { dashboard: 'Dashboard', bookings: 'Bookings', customers: 'Customers' },
        user: 'Ana',
        dashboard: {
            greeting: 'Good morning, Ana',
            stats: [
                { label: 'Revenue today', value: '$1,240', delta: '+12%', up: true },
                { label: 'Bookings', value: '38', delta: '+5', up: true },
                { label: 'New customers', value: '7', delta: '+2', up: true },
                { label: 'Occupancy', value: '86%', delta: '-3%', up: false },
            ],
            chartTitle: 'Bookings',
            week: 'Week',
            month: 'Month',
            weekLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            weekData: [22, 31, 27, 38, 34, 45, 29],
            monthLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            monthData: [168, 192, 181, 226],
            todayTitle: "Today's schedule",
        },
        bookings: {
            newBooking: 'New booking',
            filters: { all: 'All', confirmed: 'Confirmed', pending: 'Pending', cancelled: 'Cancelled' },
            columns: { customer: 'Customer', service: 'Service', time: 'Time', status: 'Status' },
            rows: [
                { customer: 'Tamar G.', service: 'Haircut & styling', time: '10:00', status: 'confirmed' },
                { customer: 'Levan B.', service: 'Beard trim', time: '10:30', status: 'confirmed' },
                { customer: 'Elene K.', service: 'Colour', time: '11:15', status: 'pending' },
                { customer: 'Sandro M.', service: 'Haircut', time: '12:00', status: 'confirmed' },
                { customer: 'Keti D.', service: 'Manicure', time: '13:30', status: 'pending' },
                { customer: 'Dato R.', service: 'Haircut', time: '14:00', status: 'cancelled' },
            ],
            newRow: { customer: 'New customer', service: 'Consultation' },
            statusHint: 'Click a status to change it',
            empty: 'No bookings with this status',
        },
        statuses: { confirmed: 'Confirmed', pending: 'Pending', cancelled: 'Cancelled' },
        customers: {
            searchPlaceholder: 'Search customers…',
            visits: 'visits',
            spent: 'spent',
            rows: [
                { name: 'Elene K.', visits: 22, spent: '$1,480' },
                { name: 'Keti D.', visits: 17, spent: '$890' },
                { name: 'Tamar G.', visits: 14, spent: '$620' },
                { name: 'Levan B.', visits: 9, spent: '$310' },
                { name: 'Sandro M.', visits: 5, spent: '$160' },
                { name: 'Dato R.', visits: 3, spent: '$95' },
            ],
            empty: 'No customers found',
        },
    },
};

const ka: PreviewContent = {
    landing: {
        brand: 'Pulse',
        navCta: 'სცადე უფასოდ',
        badge: 'ახალი წევრებისთვის პირველი კვირა უფასოა',
        title: 'დღეში 30 წუთი და ფორმაში ხარ',
        subtitle: 'ვარჯიში მცირე ჯგუფებში, ტრენერთან, რომელიც სახელით გიცნობს. კონტრაქტისა და გადაჭედილი დარბაზის გარეშე.',
        cta: 'დაჯავშნე უფასო კვირა',
        stats: [
            { value: '40+', label: 'ვარჯიში კვირაში' },
            { value: '12', label: 'ტრენერი' },
            { value: '4.9', label: 'წევრების შეფასება' },
        ],
        scheduleTitle: 'დღევანდელი ვარჯიშები',
        schedule: [
            { time: '07:30', name: 'დილის ძალოვანი', coach: 'ნიკასთან' },
            { time: '12:15', name: 'შუადღის HIIT', coach: 'ანასთან' },
            { time: '19:00', name: 'საღამოს სტრეჩინგი', coach: 'ლუკასთან' },
        ],
        benefitsTitle: 'რატომ რჩებიან ჩვენთან',
        benefits: [
            { title: 'მოკლე ვარჯიშები', text: '30 წუთი, რომელსაც სამსახურამდეც მოასწრებ და შესვენებაზეც.' },
            { title: 'ინდივიდუალური ყურადღება', text: 'ჯგუფში მაქსიმუმ რვა ადამიანია, ამიტომ ტრენერი ყველას ტექნიკას აკვირდება.' },
            { title: 'მოქნილი აბონემენტი', text: 'შეაჩერე ან გააუქმე ნებისმიერ დროს, პირდაპირ ტელეფონიდან.' },
        ],
        quote: 'უფასო კვირის გამო მოვედი და უკვე ერთი წელია დავდივარ. პირველი დარბაზია, სადაც სიამოვნებით მივდივარ.',
        quoteAuthor: 'მარიამი, წევრია 2025 წლიდან',
        formTitle: 'დაიწყე უფასო კვირით',
        formText: 'დაგვიტოვე ნომერი და დაგირეკავთ, რომ პირველი ვარჯიში ერთად შევარჩიოთ.',
        nameLabel: 'სახელი',
        phoneLabel: 'ტელეფონის ნომერი',
        classLabel: 'სასურველი ვარჯიში',
        submit: 'დაჯავშნე უფასო კვირა',
        successTitle: '{name}, ადგილი დაჯავშნილია!',
        successText: 'დღესვე დაგირეკავთ პირველი ვარჯიშის დასადასტურებლად.',
        again: 'ახალი ჯავშანი',
        footer: '© Pulse Studio · სანიმუშო ლენდინგ გვერდი',
    },
    business: {
        brand: 'Mira Dental',
        nav: { home: 'მთავარი', services: 'სერვისები', about: 'ჩვენ შესახებ', contact: 'კონტაქტი' },
        menuLabel: 'მენიუ',
        phone: '+995 5XX XX XX XX',
        home: {
            badge: 'საოჯახო სტომატოლოგია თბილისში',
            title: 'სტომატოლოგთან ვიზიტი სტრესის გარეშე',
            subtitle: 'თანამედროვე მკურნალობა უფროსებისა და ბავშვებისთვის. ფასი წინასწარ იცით, ვიზიტი კი დანიშნულ დროს იწყება.',
            cta: 'ჩაეწერეთ ვიზიტზე',
            secondary: 'ჩვენი სერვისები',
            cardLabel: 'უახლოესი თავისუფალი დრო',
            cardValue: 'დღეს, 15:30',
            cardCta: 'დაჯავშნა',
            highlights: [
                { title: 'ვიზიტი იმავე კვირაში', text: 'ახალ პაციენტს, როგორც წესი, სამ დღეში ვიღებთ.' },
                { title: 'გამჭვირვალე ფასები', text: 'მკურნალობის დაწყებამდე გეგმასა და ფასს წერილობით მიიღებთ.' },
                { title: 'ბავშვებზე მორგებული', text: 'ბავშვთა სტომატოლოგი და მოსაცდელი, სადაც პატარები არ მოიწყენენ.' },
            ],
            servicesTitle: 'პოპულარული სერვისები',
            allServices: 'ყველა სერვისი',
        },
        services: {
            title: 'სერვისები',
            subtitle: 'პროფილაქტიკური შემოწმებიდან ღიმილის სრულ აღდგენამდე.',
            items: [
                { name: 'შემოწმება და წმენდა', text: 'კონსულტაცია, პროფესიული წმენდა და რჩევები.', price: '80 ₾-დან' },
                { name: 'დაბჟენა', text: 'ესთეტიკური ბჟენი ერთ ვიზიტში.', price: '120 ₾-დან' },
                { name: 'კბილების გათეთრება', text: 'უსაფრთხო გათეთრება კლინიკაში.', price: '300 ₾-დან' },
                { name: 'ბრეკეტები და ელაინერები', text: 'თანკბილვის გასწორება ნებისმიერ ასაკში.', price: '2,400 ₾-დან' },
                { name: 'იმპლანტაცია', text: 'დაკარგული კბილის საიმედო აღდგენა.', price: '1,700 ₾-დან' },
                { name: 'ბავშვთა სტომატოლოგია', text: 'მზრუნველი მიდგომა პატარა პაციენტებისთვის.', price: '60 ₾-დან' },
            ],
        },
        about: {
            title: 'კლინიკის შესახებ',
            text: 'Mira Dental 2014 წელს გაიხსნა, ერთი სავარძლითა და ერთი წესით: პაციენტს ყველაფერი გასაგებად ავუხსნათ. დღეს ჩვენი ცხრაკაციანი გუნდი წელიწადში 4,000-ზე მეტ პაციენტს ემსახურება.',
            stats: [
                { value: '12', label: 'წლის გამოცდილება' },
                { value: '4,000+', label: 'პაციენტი წელიწადში' },
                { value: '9', label: 'სპეციალისტი' },
            ],
            teamTitle: 'გაიცანით ჩვენი გუნდი',
            team: [
                { name: 'ექიმი ნინო კ.', role: 'წამყვანი სტომატოლოგი' },
                { name: 'ექიმი გიორგი მ.', role: 'ორთოდონტი' },
                { name: 'ექიმი სალომე თ.', role: 'ბავშვთა სტომატოლოგი' },
            ],
        },
        contact: {
            title: 'კონტაქტი',
            subtitle: 'დაგვირეკეთ ან დაგვიტოვეთ შეტყობინება და იმავე დღეს დაგიკავშირდებით.',
            addressLabel: 'მისამართი',
            address: 'თბილისი, სანიმუშო ქ. 12',
            hoursLabel: 'სამუშაო საათები',
            hours: 'ორშ–შაბ, 10:00–19:00',
            phoneLabel: 'ტელეფონი',
            formTitle: 'ჩაეწერეთ ვიზიტზე',
            nameLabel: 'სახელი',
            phoneFieldLabel: 'ტელეფონის ნომერი',
            messageLabel: 'რით შეგვიძლია დაგეხმაროთ?',
            submit: 'გაგზავნა',
            successTitle: 'განაცხადი მიღებულია',
            successText: 'გმადლობთ, {name}. დღესვე დაგირეკავთ.',
        },
        footer: '© Mira Dental · სანიმუშო ბიზნეს ვებსაიტი',
    },
    ecommerce: {
        brand: 'Tela',
        searchPlaceholder: 'ძებნა…',
        cartLabel: 'კალათა',
        heroTitle: 'ხელნაკეთი კერამიკა ყოველდღიური სუფრისთვის',
        heroText: 'თითოეულ ნივთს ხელით ვამზადებთ და ვჭიქავთ თბილისში, მცირე რაოდენობით. მიწოდება ყველა შეკვეთაზე უფასოა.',
        categories: { all: 'ყველა', cups: 'ფინჯნები', plates: 'თეფშები და ჯამები', vases: 'ლარნაკები' },
        products: [
            { name: 'წინწკლებიანი ფინჯანი', price: 45, badge: 'ბესტსელერი' },
            { name: 'სადილის თეფში', price: 55 },
            { name: 'პატარა ლარნაკი', price: 70 },
            { name: 'საუზმის ჯამი', price: 40 },
            { name: 'ესპრესოს ფინჯნების ნაკრები', price: 60 },
            { name: 'მაღალი ლარნაკი', price: 115, badge: 'ახალი' },
            { name: 'სასუფრე ლანგარი', price: 95 },
            { name: 'ჩაის ფინჯანი', price: 35 },
        ],
        currency: { prefix: '', suffix: ' ₾' },
        add: 'დამატება',
        added: 'დამატებულია',
        empty: 'ვერაფერი მოიძებნა',
        cartTitle: 'კალათა',
        cartEmpty: 'კალათა ცარიელია',
        subtotal: 'ჯამი',
        shipping: 'მიწოდება',
        shippingValue: 'უფასო',
        checkout: 'შეკვეთის გაფორმება',
        remove: 'წაშლა',
        close: 'კალათის დახურვა',
        orderTitle: 'შეკვეთა მიღებულია',
        orderText: 'ეს დემო ვერსიაა, ამიტომ თანხა არ ჩამოგეჭრებათ. რეალურ მაღაზიაში ამ ეტაპზე ბარათით გადაიხდით.',
        keepShopping: 'ყიდვის გაგრძელება',
        footer: '© Tela Ceramics · სანიმუშო ონლაინ მაღაზია',
    },
    webapp: {
        brand: 'Deskly',
        nav: { dashboard: 'მთავარი', bookings: 'ჯავშნები', customers: 'კლიენტები' },
        user: 'ანა',
        dashboard: {
            greeting: 'დილა მშვიდობისა, ანა',
            stats: [
                { label: 'დღევანდელი შემოსავალი', value: '3,220 ₾', delta: '+12%', up: true },
                { label: 'ჯავშნები', value: '38', delta: '+5', up: true },
                { label: 'ახალი კლიენტები', value: '7', delta: '+2', up: true },
                { label: 'დატვირთვა', value: '86%', delta: '-3%', up: false },
            ],
            chartTitle: 'ჯავშნები',
            week: 'კვირა',
            month: 'თვე',
            weekLabels: ['ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ', 'კვი'],
            weekData: [22, 31, 27, 38, 34, 45, 29],
            monthLabels: ['1-ლი კვირა', 'მე-2 კვირა', 'მე-3 კვირა', 'მე-4 კვირა'],
            monthData: [168, 192, 181, 226],
            todayTitle: 'დღევანდელი განრიგი',
        },
        bookings: {
            newBooking: 'ახალი ჯავშანი',
            filters: { all: 'ყველა', confirmed: 'დადასტურებული', pending: 'მოლოდინში', cancelled: 'გაუქმებული' },
            columns: { customer: 'კლიენტი', service: 'სერვისი', time: 'დრო', status: 'სტატუსი' },
            rows: [
                { customer: 'თამარ გ.', service: 'თმის შეჭრა და ვარცხნილობა', time: '10:00', status: 'confirmed' },
                { customer: 'ლევან ბ.', service: 'წვერის კორექცია', time: '10:30', status: 'confirmed' },
                { customer: 'ელენე კ.', service: 'თმის შეღებვა', time: '11:15', status: 'pending' },
                { customer: 'სანდრო მ.', service: 'თმის შეჭრა', time: '12:00', status: 'confirmed' },
                { customer: 'ქეთი დ.', service: 'მანიკური', time: '13:30', status: 'pending' },
                { customer: 'დათო რ.', service: 'თმის შეჭრა', time: '14:00', status: 'cancelled' },
            ],
            newRow: { customer: 'ახალი კლიენტი', service: 'კონსულტაცია' },
            statusHint: 'დააჭირეთ სტატუსს მის შესაცვლელად',
            empty: 'ამ სტატუსით ჯავშანი არ არის',
        },
        statuses: { confirmed: 'დადასტურებული', pending: 'მოლოდინში', cancelled: 'გაუქმებული' },
        customers: {
            searchPlaceholder: 'კლიენტის ძებნა…',
            visits: 'ვიზიტები',
            spent: 'დანახარჯი',
            rows: [
                { name: 'ელენე კ.', visits: 22, spent: '3,850 ₾' },
                { name: 'ქეთი დ.', visits: 17, spent: '2,310 ₾' },
                { name: 'თამარ გ.', visits: 14, spent: '1,610 ₾' },
                { name: 'ლევან ბ.', visits: 9, spent: '805 ₾' },
                { name: 'სანდრო მ.', visits: 5, spent: '415 ₾' },
                { name: 'დათო რ.', visits: 3, spent: '245 ₾' },
            ],
            empty: 'კლიენტი ვერ მოიძებნა',
        },
    },
};

export const previewContent: Record<PreviewLocale, PreviewContent> = { en, ka };
