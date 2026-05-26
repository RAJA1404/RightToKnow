import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../translations';

const CONTENT = {
  en: {
    lang: 'EN',
    altLang: 'தமிழ்',
    pageTitle: 'How to File an RTI Application',
    pageSubtitle: 'Step-by-step guide to filing your Right to Information request',
    steps: [
      {
        no: '01',
        title: 'Identify the Public Authority',
        icon: '🏛️',
        body: [
          'Determine which government department or public authority holds the information you need.',
          'RTI applies to all authorities established under the Constitution or any law made by Parliament/State Legislature, bodies owned or controlled by the government, and bodies substantially financed by government funds.',
          'Examples: District Collector Office, Panchayat, Municipal Corporation, State Government Departments, Central Government Ministries.',
        ],
        note: 'Tip: If you are unsure which department to approach, you may address the application to the Public Information Officer (PIO) of the parent ministry or a nearby government office.',
      },
      {
        no: '02',
        title: 'Prepare Your RTI Application',
        icon: '📝',
        body: [
          'Write your application in English, Hindi, or the official language of the area.',
          'Address the letter to the Public Information Officer (PIO) of the concerned department.',
          'Clearly state the information you are seeking. Be specific — vague questions may cause delays.',
          'Include your full name, address, and contact number.',
          'You do NOT need to give any reason for seeking information.',
        ],
        note: 'Important: You can file your RTI online through this portal. Fill in the district, department, subject, and description of the information sought.',
      },
      {
        no: '03',
        title: 'Pay the Application Fee',
        icon: '💰',
        body: [
          'A nominal fee of ₹10 (Rupees Ten Only) is required for filing an RTI application with Central Government authorities.',
          'For State Government authorities in Tamil Nadu, the fee may vary (commonly ₹10).',
          'Payment can be made by: Cash, Demand Draft, Indian Postal Order (IPO), or online payment through official portals.',
          'Persons below the poverty line (BPL) are EXEMPTED from paying the application fee. Attach a copy of your BPL certificate.',
        ],
        note: 'Note: Fee for obtaining information (photocopies) is ₹2 per page. Inspection of records is free for the first hour.',
      },
      {
        no: '04',
        title: 'Submit Your Application',
        icon: '📤',
        body: [
          'Online: File directly through this portal by clicking "File New RTI Application" on your dashboard.',
          'By Post: Send your signed application by registered/speed post to the PIO of the concerned department.',
          'In Person: Submit at the department office and obtain an acknowledgement receipt with date and stamp.',
          'Keep a copy of your application and proof of submission for your records.',
        ],
        note: 'After submitting through this portal, you will receive an Application Number. Note it down for future tracking.',
      },
      {
        no: '05',
        title: 'Wait for Response (30 Days)',
        icon: '⏳',
        body: [
          'The PIO is legally required to reply within 30 days of receiving your application.',
          'If the information concerns the life or liberty of a person, the response must be given within 48 hours.',
          'If the PIO transfers your application to another department, the time limit is 30 days from the date of receipt by the original PIO.',
          'You can track the status of your application on the "My Applications" page of this portal.',
        ],
        note: 'If no response is received within 30 days, it is deemed a refusal and you can file a First Appeal.',
      },
      {
        no: '06',
        title: 'File a First Appeal (If Needed)',
        icon: '📋',
        body: [
          'If the PIO does not respond within 30 days, provides incomplete information, or refuses your request, you can file a First Appeal.',
          'Address the First Appeal to the First Appellate Authority (FAA) of the same department, within 30 days of the deadline or refusal.',
          'The FAA must decide on the appeal within 30 days (extendable to 45 days with reasons).',
          'Include: Your original RTI application, PIO\'s response (if any), and grounds for appeal.',
        ],
        note: 'There is no fee for filing a First Appeal.',
      },
      {
        no: '07',
        title: 'File a Second Appeal (State Information Commission)',
        icon: '⚖️',
        body: [
          'If you are dissatisfied with the First Appellate Authority\'s decision (or non-response), file a Second Appeal.',
          'For Tamil Nadu State government matters: Appeal to the Tamil Nadu State Information Commission (TNSIC).',
          'For Central Government matters: Appeal to the Central Information Commission (CIC).',
          'File within 90 days of the FAA\'s decision or deadline.',
          'The Information Commission can impose penalties up to ₹25,000 on the PIO for non-compliance.',
        ],
        note: 'The Information Commission\'s decision is binding and can be challenged only in a High Court.',
      },
    ],
    dosDonts: {
      title: "Do's and Don'ts",
      dos: [
        'Be specific and clear about the information you need',
        'Mention the time period for which information is sought',
        'Ask for certified copies if required',
        'Keep all acknowledgements and copies safely',
        'File appeals if response is unsatisfactory',
        'Provide correct contact information',
      ],
      donts: [
        "Don't ask for opinions or explanations — only facts and records",
        "Don't use offensive or abusive language",
        "Don't ask for too many unrelated questions in one application",
        "Don't miss the appeal deadlines",
        "Don't ask for information that affects national security",
        "Don't ask for personal information of third parties unless in public interest",
      ],
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        { q: 'Who can file an RTI?', a: 'Any Indian citizen can file an RTI application. There is no restriction based on age, education, or profession.' },
        { q: 'Can I file RTI for any government department?', a: 'Yes. RTI applies to all public authorities — Central, State and Local government bodies — except those specifically exempted (intelligence agencies like IB, RAW).' },
        { q: 'What if the information is partly given?', a: 'If information is given partially or is incomplete, you should file a First Appeal mentioning specifically what information is missing.' },
        { q: 'Can I withdraw my RTI application?', a: 'There is no provision to formally withdraw an RTI. However, you can simply not pursue the matter further.' },
        { q: 'Is there any penalty for giving false information?', a: 'Yes. A PIO who gives false or misleading information can be penalized by the Information Commission.' },
      ],
    },
  },

  ta: {
    lang: 'தமிழ்',
    altLang: 'EN',
    pageTitle: 'RTI விண்ணப்பம் தாக்கல் செய்வது எப்படி?',
    pageSubtitle: 'தகவல் அறியும் உரிமைக்கான விண்ணப்பம் தாக்கல் செய்வதற்கான படிப்படியான வழிகாட்டி',
    steps: [
      {
        no: '01',
        title: 'பொது அதிகாரத்தை கண்டறியவும்',
        icon: '🏛️',
        body: [
          'நீங்கள் எந்த அரசு துறையிடம் அல்லது பொது அதிகாரத்திடம் தகவல் பெற விரும்புகிறீர்கள் என்பதை முதலில் தீர்மானியுங்கள்.',
          'RTI சட்டம் அரசியலமைப்பின் கீழ் அல்லது நாடாளுமன்ற / மாநில சட்டமன்றச் சட்டங்களின் கீழ் நிறுவப்பட்ட அனைத்து அமைப்புகளுக்கும் பொருந்தும்.',
          'உதாரணங்கள்: மாவட்ட ஆட்சித் தலைவர் அலுவலகம், பஞ்சாயத்து, நகராட்சி, மாநில அரசு துறைகள், மத்திய அரசு அமைச்சகங்கள்.',
        ],
        note: 'குறிப்பு: எந்த துறையை அணுக வேண்டும் என்று தெரியாவிட்டால், தொடர்புடைய அமைச்சகத்தின் பொதுத் தகவல் அதிகாரிக்கு (PIO) விண்ணப்பிக்கலாம்.',
      },
      {
        no: '02',
        title: 'RTI விண்ணப்பத்தை தயாரிக்கவும்',
        icon: '📝',
        body: [
          'விண்ணப்பத்தை ஆங்கிலம், இந்தி அல்லது உங்கள் பகுதியின் அதிகாரப்பூர்வ மொழியில் எழுதலாம்.',
          'கடிதத்தை சம்பந்தப்பட்ட துறையின் பொதுத் தகவல் அதிகாரிக்கு (PIO) அனுப்பவும்.',
          'நீங்கள் கோரும் தகவலை தெளிவாக குறிப்பிடவும். தெளிவற்ற கேள்விகள் தாமதத்தை ஏற்படுத்தலாம்.',
          'உங்கள் முழு பெயர், முகவரி மற்றும் தொலைபேசி எண்ணை சேர்க்கவும்.',
          'தகவல் கேட்பதற்கு காரணம் தெரிவிக்க தேவையில்லை.',
        ],
        note: 'முக்கியம்: இந்த போர்ட்டல் மூலம் RTI ஐ நேரடியாக தாக்கல் செய்யலாம். மாவட்டம், துறை, விஷயம் மற்றும் தகவல் விவரங்களை பூர்த்தி செய்யவும்.',
      },
      {
        no: '03',
        title: 'விண்ணப்பக் கட்டணம் செலுத்தவும்',
        icon: '💰',
        body: [
          'மத்திய அரசு அமைப்புகளுக்கு RTI விண்ணப்பம் தாக்கல் செய்ய ₹10 (பத்து ரூபாய் மட்டும்) கட்டணம் செலுத்த வேண்டும்.',
          'தமிழ்நாடு மாநில அரசு அமைப்புகளுக்கு கட்டணம் வேறுபடலாம் (பொதுவாக ₹10).',
          'கட்டணம் செலுத்துவதற்கான வழிகள்: பணம், டிமாண்ட் டிராஃப்ட், இந்திய தபால் ஆணை (IPO) அல்லது அதிகாரப்பூர்வ போர்ட்டல் மூலம்.',
          'வறுமை ரேகைக்கு கீழுள்ள (BPL) நபர்கள் கட்டணத்திலிருந்து விலக்கு பெறுவார்கள். BPL சான்றிதழின் நகலை இணைக்கவும்.',
        ],
        note: 'குறிப்பு: நகல்களுக்கான கட்டணம் ₹2 (ஒரு பக்கம்). முதல் ஒரு மணி நேர ஆவண ஆய்வு இலவசம்.',
      },
      {
        no: '04',
        title: 'விண்ணப்பத்தை சமர்ப்பிக்கவும்',
        icon: '📤',
        body: [
          'ஆன்லைன்: இந்த போர்ட்டல் மூலம் நேரடியாக தாக்கல் செய்யலாம். "புதிய RTI விண்ணப்பம் தாக்கல்" என்ற பொத்தானை கிளிக் செய்யவும்.',
          'தபால் மூலம்: கையொப்பமிட்ட விண்ணப்பத்தை பதிவு / விரைவு தபால் மூலம் PIO க்கு அனுப்பவும்.',
          'நேரில்: துறை அலுவலகத்தில் சமர்ப்பித்து, தேதி மற்றும் முத்திரையுடன் ரசீது பெறவும்.',
          'விண்ணப்பத்தின் நகலையும் சமர்ப்பிப்பின் சான்றையும் பாதுகாப்பாக வைத்திருங்கள்.',
        ],
        note: 'இந்த போர்ட்டல் மூலம் சமர்ப்பித்த பிறகு, விண்ணப்ப எண் கிடைக்கும். நிலை கண்காணிப்பிற்கு இந்த எண்ணை குறித்து வைக்கவும்.',
      },
      {
        no: '05',
        title: 'பதிலுக்காக காத்திருங்கள் (30 நாட்கள்)',
        icon: '⏳',
        body: [
          'PIO விண்ணப்பம் பெற்ற 30 நாட்களுக்குள் சட்டப்படி பதிலளிக்க வேண்டும்.',
          'ஒரு நபரின் உயிர் அல்லது சுதந்திரம் தொடர்பான தகவலாக இருந்தால், 48 மணி நேரத்திற்குள் பதிலளிக்க வேண்டும்.',
          'வேறு துறைக்கு விண்ணப்பம் மாற்றப்பட்டால், அந்த துறை பெற்ற நாளிலிருந்து 30 நாட்கள் கணக்கிடப்படும்.',
          '"என் விண்ணப்பங்கள்" பக்கத்தில் விண்ணப்பத்தின் நிலையை கண்காணிக்கலாம்.',
        ],
        note: '30 நாட்களுக்குள் பதில் வரவில்லையென்றால், அது மறுப்பாக கருதப்படும் — முதல் மேல் முறையீடு தாக்கல் செய்யலாம்.',
      },
      {
        no: '06',
        title: 'முதல் மேல் முறையீடு தாக்கல் செய்யவும் (தேவைப்பட்டால்)',
        icon: '📋',
        body: [
          'PIO 30 நாட்களுக்குள் பதில் கொடுக்கவில்லை, அல்லது முழுமையற்ற தகவல் தந்தால், முதல் மேல் முறையீடு தாக்கல் செய்யலாம்.',
          'அதே துறையின் முதல் மேல் முறையீட்டு அதிகாரிக்கு (FAA) 30 நாட்களுக்குள் விண்ணப்பிக்கவும்.',
          'FAA 30 நாட்களுக்குள் (காரணத்துடன் 45 நாட்கள் வரை நீட்டிக்கலாம்) முடிவு எடுக்க வேண்டும்.',
        ],
        note: 'முதல் மேல் முறையீட்டிற்கு கட்டணம் இல்லை.',
      },
      {
        no: '07',
        title: 'இரண்டாம் மேல் முறையீடு (தமிழ்நாடு மாநில தகவல் ஆணையம்)',
        icon: '⚖️',
        body: [
          'முதல் மேல் முறையீட்டு முடிவில் திருப்தியில்லாவிட்டால், இரண்டாம் மேல் முறையீடு தாக்கல் செய்யலாம்.',
          'தமிழ்நாடு மாநில அரசு விஷயங்களுக்கு: தமிழ்நாடு மாநில தகவல் ஆணையம் (TNSIC) யிடம் மேல் முறையீடு செய்யவும்.',
          'மத்திய அரசு விஷயங்களுக்கு: மத்திய தகவல் ஆணையம் (CIC) யிடம் மேல் முறையீடு செய்யவும்.',
          'FAA முடிவின் 90 நாட்களுக்குள் தாக்கல் செய்யவும்.',
          'சட்டத்தை மீறும் PIO க்கு ₹25,000 வரை அபராதம் விதிக்கப்படலாம்.',
        ],
        note: 'தகவல் ஆணையத்தின் முடிவு கட்டாயமானது — உயர் நீதிமன்றத்தில் மட்டுமே சவால் செய்யலாம்.',
      },
    ],
    dosDonts: {
      title: 'செய்ய வேண்டியவை மற்றும் செய்யக் கூடாதவை',
      dos: [
        'தேவையான தகவலை குறிப்பிட்டு, தெளிவாக கேளுங்கள்',
        'தகவல் தேவைப்படும் காலகட்டத்தை குறிப்பிடுங்கள்',
        'சான்றளிக்கப்பட்ட நகல்கள் தேவை என்றால் கேளுங்கள்',
        'அனைத்து ரசீதுகளையும் நகல்களையும் பாதுகாமாக வைத்திருங்கள்',
        'பதில் திருப்தியற்றதாக இருந்தால் மேல் முறையீடு செய்யுங்கள்',
        'சரியான தொடர்பு தகவல்களை வழங்குங்கள்',
      ],
      donts: [
        'கருத்துகள் அல்லது விளக்கங்களை கேட்காதீர்கள் — உண்மைகள் மற்றும் ஆவணங்களை மட்டும் கேளுங்கள்',
        'அவமதிக்கும் அல்லது தவறான மொழியை பயன்படுத்தாதீர்கள்',
        'ஒரு விண்ணப்பத்தில் தொடர்பற்ற பல கேள்விகளை கேட்காதீர்கள்',
        'மேல் முறையீட்டு காலக்கெடுவை தவறவிடாதீர்கள்',
        'தேசிய பாதுகாப்பை பாதிக்கும் தகவல்களை கேட்காதீர்கள்',
        'மூன்றாம் தரப்பினரின் தனிப்பட்ட தகவல்களை கேட்காதீர்கள்',
      ],
    },
    faq: {
      title: 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
      items: [
        { q: 'யார் RTI தாக்கல் செய்யலாம்?', a: 'எந்த இந்திய குடிமகனும் RTI விண்ணப்பம் தாக்கல் செய்யலாம். வயது, கல்வி அல்லது தொழில் சார்ந்த கட்டுப்பாடு இல்லை.' },
        { q: 'எந்த அரசு துறையிடமும் RTI கேட்கலாமா?', a: 'ஆம். விலக்கு அளிக்கப்பட்ட சில அமைப்புகளை (IB, RAW போன்றவை) தவிர மற்ற அனைத்து பொது அதிகாரங்களுக்கும் RTI பொருந்தும்.' },
        { q: 'தகவல் பகுதியாக மட்டும் வந்தால்?', a: 'தகவல் முழுமையற்றதாக இருந்தால், என்ன தகவல் விடுபட்டது என குறிப்பிட்டு முதல் மேல் முறையீடு தாக்கல் செய்யுங்கள்.' },
        { q: 'RTI விண்ணப்பத்தை திரும்பப் பெற முடியுமா?', a: 'RTI ஐ முறையாக திரும்பப் பெற சட்டத்தில் வழி இல்லை. ஆனால் நீங்கள் மேல் நடவடிக்கை எடுக்காமல் விட்டுவிடலாம்.' },
        { q: 'தவறான தகவல் கொடுத்தால் என்ன ஆகும்?', a: 'தவறான அல்லது திரிசுடான தகவல் வழங்கும் PIO யை தகவல் ஆணையம் அபராதம் விதிக்கலாம்.' },
      ],
    },
  },
};

export default function RTIGuide() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [openFaq, setOpenFaq] = useState(null);
  const c = CONTENT[lang] || CONTENT['en'];

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar backTo="/dashboard" backLabel={t(lang, 'dashboard')} />

      <div className="page-wrap max-w-5xl mx-auto space-y-8">
        <section className="portal-hero fade-in">
          <div className="portal-hero-content">
            <div className="portal-kicker">
              <span className="portal-kicker-dot" />
              Filing Guide
            </div>
            <h2 className="mt-5 text-3xl md:text-4xl font-extrabold leading-tight">{c.pageTitle}</h2>
            <p className="mt-3 text-blue-100 leading-7 max-w-3xl">{c.pageSubtitle}</p>
          </div>
        </section>

        <div className="space-y-4">
          {c.steps.map((step) => (
            <div key={step.no} className="portal-panel p-0 overflow-hidden fade-in">
              <div className="flex items-center gap-4 px-6 py-5 bg-[#1a3a6b] text-white">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center font-bold">
                  {step.no}
                </div>
                <div>
                  <span className="text-blue-300 text-xs font-semibold tracking-wider">STEP {step.no}</span>
                  <h3 className="font-bold text-base leading-tight">{step.title}</h3>
                </div>
              </div>
              <div className="px-6 py-5">
                <ul className="space-y-2 mb-4">
                  {step.body.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="text-orange-500 font-bold mt-0.5 flex-shrink-0">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="bg-orange-50 border-l-4 border-orange-400 px-4 py-2.5 rounded-r-md">
                  <p className="text-xs text-orange-800">{step.note}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="portal-panel p-6 fade-in">
          <h3 className="portal-section-title">{c.dosDonts.title}</h3>
          <p className="portal-section-subtitle">Simple filing practices that reduce routing delays and prevent avoidable rejection.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <h4 className="font-semibold text-green-700 text-sm mb-3 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {lang === 'en' ? "Do's" : 'செய்ய வேண்டியவை'}
              </h4>
              <ul className="space-y-2">
                {c.dosDonts.dos.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-green-500 flex-shrink-0 mt-0.5">+</span> {d}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-700 text-sm mb-3 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {lang === 'en' ? "Don'ts" : 'செய்யக் கூடாதவை'}
              </h4>
              <ul className="space-y-2">
                {c.dosDonts.donts.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-red-500 flex-shrink-0 mt-0.5">x</span> {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="portal-panel p-6 fade-in">
          <h3 className="portal-section-title">{c.faq.title}</h3>
          <p className="portal-section-subtitle">Quick answers to common procedural questions before you file.</p>
          <div className="space-y-2">
            {c.faq.items.map((item, i) => (
              <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-sm text-[#1a3a6b]">{item.q}</span>
                  <svg className={`w-4 h-4 text-slate-400 flex-shrink-0 ml-2 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-3 text-sm text-slate-600 bg-slate-50 border-t border-slate-100">
                    <p className="pt-2">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#1a3a6b] rounded-lg px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 fade-in">
          <div className="text-white">
            <p className="font-bold text-base">{lang === 'en' ? 'Ready to file your RTI?' : 'RTI தாக்கல் செய்ய தயாரா?'}</p>
            <p className="text-blue-200 text-sm mt-0.5">{lang === 'en' ? 'Use this portal to submit your application online.' : 'இந்த போர்ட்டல் மூலம் ஆன்லைனில் விண்ணப்பிக்கலாம்.'}</p>
          </div>
          <button onClick={() => navigate('/file-rti')} className="btn-saffron flex-shrink-0">
            {lang === 'en' ? 'File RTI Now →' : 'RTI தாக்கல் செய்யுங்கள் →'}
          </button>
        </div>
      </div>
    </div>
  );
}
