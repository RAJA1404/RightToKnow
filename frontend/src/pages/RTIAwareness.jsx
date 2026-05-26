import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../translations';

const CONTENT = {
  en: {
    pageTitle: 'RTI Awareness',
    pageSubtitle: "Know Your Right to Information — A citizen's guide under the RTI Act, 2005",

    what: {
      title: 'What is RTI?',
      icon: '📖',
      body: `The Right to Information Act, 2005 (RTI Act) is a landmark legislation enacted by the Parliament of India. It empowers every citizen of India to seek information from any Public Authority. The Act is founded on the belief that an informed citizenry is essential for a functioning democracy and the control of corruption.`,
      highlights: [
        'Enacted: 15 June 2005, Effective: 12 October 2005',
        'Applies to all Central, State, and Local Government bodies',
        'Any Indian citizen can file an RTI — no restrictions',
        'Overrides the Official Secrets Act, 1923',
      ],
    },

    why: {
      title: 'Why is RTI Important?',
      icon: '⭐',
      points: [
        { title: 'Fight Corruption', body: 'RTI is one of the most powerful tools to expose corruption and demand accountability from public officials.' },
        { title: 'Transparency in Governance', body: 'It promotes openness in government functioning, ensuring citizens know how public money is being spent.' },
        { title: 'Empowers Citizens', body: 'It shifts power from bureaucracy to the people, making democracy more participatory and meaningful.' },
        { title: 'Ensures Accountability', body: 'Public officials are more careful and responsible when they know citizens can access their records.' },
        { title: 'Access to Entitlements', body: 'Citizens can use RTI to check the status of their ration cards, pension, certificates, and other government benefits.' },
        { title: 'Reduces Delays', body: 'Filing an RTI often speeds up stalled government work like land registration, pension processing, or project approvals.' },
      ],
    },

    scope: {
      title: 'Who is Covered Under RTI?',
      icon: '🏛️',
      covered: [
        'All Central Government Ministries and Departments',
        'All State Government Departments (including Tamil Nadu)',
        'District Collectorate, Tehsil Office, Panchayat Offices',
        'Public Sector Undertakings (PSUs) like BSNL, SBI, LIC',
        'Universities, government-aided schools and colleges',
        'Police departments and courts (administrative functions)',
        'Municipal Corporations, Town Panchayats',
        'Any body substantially financed by government funds',
      ],
      excluded: [
        'Intelligence agencies: IB, RAW, NTRO, Directorate of Revenue Intelligence',
        'Information that would affect national security or sovereignty',
        'Information that would prejudice prosecution of offenders',
        'Cabinet papers and deliberative process records',
        'Personal information with no public interest',
        'Information received from a foreign Government in confidence',
      ],
    },

    rights: {
      title: 'Your Rights Under RTI',
      icon: '🤝',
      items: [
        { title: 'Right to Access Records', body: 'Inspect works, documents, and records. Take notes, extracts, or certified copies.' },
        { title: 'Right to Certified Copies', body: 'Obtain certified copies of any government document or record.' },
        { title: 'Right to Information in Your Language', body: 'Information must be provided in the language in which the application is made or the official language of the state.' },
        { title: 'Right to Inspect Work in Progress', body: 'Inspect any government work, sample materials used in construction or other government projects.' },
        { title: 'Right to Electronically Stored Information', body: 'You can also request information stored in digital or electronic form.' },
        { title: 'Right to Appeal', body: 'If information is denied or unsatisfactory, you have the right to appeal to higher authorities, including the Information Commission.' },
      ],
    },

    timeline: {
      title: 'Key Time Limits Under RTI Act',
      icon: '⏱️',
      items: [
        { days: '48 hrs', label: 'Life or Liberty', desc: 'For information concerning life or liberty of a person — response within 48 hours.' },
        { days: '30 days', label: 'Normal Request', desc: 'Routine RTI applications must be responded to within 30 days.' },
        { days: '35 days', label: 'Third Party Info', desc: 'If information involves a third party, PIO can take up to 35 days.' },
        { days: '30 days', label: 'First Appeal', desc: 'FAA must decide on First Appeal within 30 days (up to 45 days with reasons).' },
        { days: '90 days', label: 'Second Appeal', desc: 'Second appeal to CIC/TNSIC must be filed within 90 days of FAA decision.' },
      ],
    },

    penalty: {
      title: 'Penalties for Non-Compliance',
      icon: '⚖️',
      items: [
        '₹250 per day of delay — for each day PIO fails to respond beyond deadline',
        'Maximum penalty: ₹25,000 per case imposed by the Information Commission',
        'Disciplinary action can be recommended against errant PIOs',
        'Giving false, incomplete, or misleading information is punishable',
        'Obstructing an RTI application is also an offence under the Act',
      ],
    },

    fees: {
      title: 'Fee Structure',
      icon: '💰',
      rows: [
        { item: 'Application Fee (Central Govt)', amount: '₹10' },
        { item: 'Application Fee (Tamil Nadu State Govt)', amount: '₹10' },
        { item: 'Photocopy of records (per page A4/A3)', amount: '₹2' },
        { item: 'Floppy / CD / DVD', amount: '₹50' },
        { item: 'Inspection of records (first hour)', amount: 'Free' },
        { item: 'Inspection of records (each subsequent hour)', amount: '₹5' },
        { item: 'BPL Applicants (with BPL certificate)', amount: 'Fully Exempt' },
      ],
    },

    usecases: {
      title: 'Common Uses of RTI',
      icon: '💡',
      items: [
        'Check the status of your ration card, pension, or scholarship application',
        'Know how public funds were spent on roads, drains, or government schemes',
        "Verify if a government employee's appointment was done correctly",
        'Track delays in your property registration or land record mutation',
        'Know the qualifications of elected representatives or appointed officials',
        'Access environmental clearance documents for projects near your area',
        'Verify the number of beneficiaries under welfare schemes like PM Awas, MGNREGS',
        'Know the action taken on your complaint filed with the police or local body',
      ],
    },

    contact: {
      title: 'Key Contacts in Tamil Nadu',
      items: [
        { label: 'Tamil Nadu State Information Commission (TNSIC)', value: 'No. 3, Theyagaraya Road, T. Nagar, Chennai - 600017' },
        { label: 'TNSIC Helpline', value: '044-24333610' },
        { label: 'RTI Online Portal (Central)', value: 'https://rtionline.gov.in' },
        { label: 'Central Information Commission (CIC)', value: 'Auguste Helard Marg, New Delhi - 110001' },
      ],
    },
  },

  ta: {
    pageTitle: 'RTI விழிப்புணர்வு',
    pageSubtitle: 'தகவல் அறியும் உரிமை சட்டம் 2005 — குடிமகன் வழிகாட்டி',

    what: {
      title: 'RTI என்றால் என்ன?',
      icon: '📖',
      body: `தகவல் அறியும் உரிமைச் சட்டம் 2005 (RTI Act) என்பது இந்திய நாடாளுமன்றம் இயற்றிய ஒரு முக்கியமான சட்டம். இது இந்தியாவின் ஒவ்வொரு குடிமகனுக்கும் எந்தவொரு பொது அதிகாரத்திடமிருந்தும் தகவல்களை பெறும் உரிமையை வழங்குகிறது. ஊழலை கட்டுப்படுத்தவும் ஜனநாயகத்தை சரிவர செயல்படுத்தவும் இந்த சட்டம் இன்றியமையாதது.`,
      highlights: [
        'நிறைவேற்றப்பட்டது: 15 ஜூன் 2005, நடைமுறைக்கு வந்தது: 12 அக்டோபர் 2005',
        'மத்திய, மாநில மற்றும் உள்ளாட்சி அரசு அமைப்புகளுக்கு பொருந்தும்',
        'எந்த இந்திய குடிமகனும் RTI தாக்கல் செய்யலாம் — கட்டுப்பாடு இல்லை',
        'அரசியல் இரகசியச் சட்டம் 1923 ஐ மீறி இந்த சட்டம் பொருந்தும்',
      ],
    },

    why: {
      title: 'RTI ஏன் முக்கியம்?',
      icon: '⭐',
      points: [
        { title: 'ஊழலை எதிர்க்க', body: 'அரசு அதிகாரிகளிடம் பதவிப்பொறுப்பு கோரவும் ஊழலை அம்பலப்படுத்தவும் RTI ஒரு சக்திவாய்ந்த கருவி.' },
        { title: 'வெளிப்படையான ஆட்சி', body: 'அரசு நிதி எவ்வாறு செலவிடப்படுகிறது என்று குடிமக்கள் அறியலாம்; இது நிர்வாகத்தில் வெளிப்படுத்தலை அதிகரிக்கும்.' },
        { title: 'குடிமக்களை வலுப்படுத்தும்', body: 'அதிகாரிகளின் கைகளிலிருந்து மக்களுக்கு அதிகாரத்தை மாற்றுகிறது, ஜனநாயகத்தை மிகவும் பங்கேற்பு சார்ந்ததாக ஆக்குகிறது.' },
        { title: 'பதவிப்பொறுப்பை உறுதிசெய்யும்', body: 'குடிமக்கள் தங்கள் பதிவுகளை அணுகலாம் என்று தெரியும்போது, அரசு அதிகாரிகள் மிகவும் கவனமாக இருப்பார்கள்.' },
        { title: 'உரிமைகளை பெற', body: 'ரேஷன் கார்டு, ஓய்வூதியம், சான்றிதழ் நிலை போன்றவற்றை RTI மூலம் சரிபார்க்கலாம்.' },
        { title: 'தாமதத்தை குறைக்கும்', body: 'நிலப்பதிவு, ஓய்வூதியம், திட்ட அனுமதி போன்றவற்றில் தாமதமாகும்போது RTI தாக்கல் செய்வது வேலையை விரைவுபடுத்தும்.' },
      ],
    },

    scope: {
      title: 'RTI கீழ் யார் வருவார்கள்?',
      icon: '🏛️',
      covered: [
        'அனைத்து மத்திய அரசு அமைச்சகங்கள் மற்றும் துறைகள்',
        'அனைத்து மாநில அரசு துறைகள் (தமிழ்நாடு உட்பட)',
        'மாவட்ட ஆட்சியர் அலுவலகம், தாலுகா அலுவலகம், பஞ்சாயத்து அலுவலகங்கள்',
        'பொதுத்துறை நிறுவனங்கள்: BSNL, SBI, LIC',
        'பல்கலைக்கழகங்கள், அரசு உதவி பெறும் பள்ளிகள் மற்றும் கல்லூரிகள்',
        'காவல் துறை மற்றும் நீதிமன்றங்கள் (நிர்வாக செயல்பாடுகளுக்கு)',
        'நகராட்சிகள், நகர ஊராட்சிகள்',
        'அரசாங்க நிதியால் கணிசமாக நிதியளிக்கப்படும் அமைப்புகள்',
      ],
      excluded: [
        'உளவு அமைப்புகள்: IB, RAW, NTRO',
        'தேசிய பாதுகாப்பை பாதிக்கக்கூடிய தகவல்கள்',
        'குற்றவியல் வழக்கு விசாரணையை பாதிக்கும் தகவல்கள்',
        'அமைச்சரவை ஆவணங்கள் (cabinet papers)',
        'தனிப்பட்ட தகவல்கள் — பொது நலனில்லாவிட்டால்',
        'வெளிநாட்டு அரசாங்கங்களிடமிருந்து இரகசியமாக பெறப்பட்ட தகவல்',
      ],
    },

    rights: {
      title: 'RTI கீழ் உங்கள் உரிமைகள்',
      icon: '🤝',
      items: [
        { title: 'ஆவணங்களை ஆய்வு செய்யும் உரிமை', body: 'அரசு வேலைகள், ஆவணங்கள் மற்றும் பதிவுகளை ஆய்வு செய்து குறிப்புகள் அல்லது சான்றளிக்கப்பட்ட நகல்களை பெறலாம்.' },
        { title: 'சான்றளிக்கப்பட்ட நகல்களுக்கான உரிமை', body: 'எந்த அரசு ஆவணத்தின் சான்றளிக்கப்பட்ட நகலையும் பெறலாம்.' },
        { title: 'உங்கள் மொழியில் தகவல் பெறும் உரிமை', body: 'நீங்கள் விண்ணப்பித்த மொழியில் அல்லது மாநிலத்தின் அதிகாரப்பூர்வ மொழியில் தகவல் வழங்கப்படும்.' },
        { title: 'கட்டுமான பணிகளை ஆய்வு செய்யும் உரிமை', body: 'அரசு கட்டுமான பணிகளில் பயன்படுத்தப்படும் பொருட்களின் மாதிரிகளை ஆய்வு செய்யலாம்.' },
        { title: 'மின்னணு தகவல் பெறும் உரிமை', body: 'டிஜிட்டல் அல்லது மின்னணு வடிவில் சேமிக்கப்பட்ட தகவல்களையும் கோரலாம்.' },
        { title: 'மேல் முறையீட்டு உரிமை', body: 'தகவல் மறுக்கப்பட்டால் அல்லது திருப்தியற்றதாக இருந்தால், தகவல் ஆணையம் வரை மேல் முறையீடு செய்யலாம்.' },
      ],
    },

    timeline: {
      title: 'RTI சட்டத்தின் முக்கிய கால வரம்புகள்',
      icon: '⏱️',
      items: [
        { days: '48 மணி', label: 'உயிர் பாதுகாப்பு', desc: 'ஒருவரின் உயிர் அல்லது சுதந்திரம் தொடர்பான தகவல் — 48 மணி நேரத்துக்குள் பதில் வேண்டும்.' },
        { days: '30 நாள்', label: 'வழக்கமான கோரிக்கை', desc: 'சாதாரண RTI விண்ணப்பங்களுக்கு 30 நாட்களுக்குள் பதில் வழங்க வேண்டும்.' },
        { days: '35 நாள்', label: 'மூன்றாம் தரப்பு தகவல்', desc: 'மூன்றாம் தரப்பினர் தொடர்பான தகவல்களுக்கு PIO 35 நாட்கள் எடுக்கலாம்.' },
        { days: '30 நாள்', label: 'முதல் மேல் முறையீடு', desc: 'FAA முதல் மேல் முறையீட்டை 30 நாட்களுக்குள் தீர்க்க வேண்டும் (காரணத்துடன் 45 நாட்கள்).' },
        { days: '90 நாள்', label: 'இரண்டாம் மேல் முறையீடு', desc: 'CIC/TNSIC யிடம் இரண்டாம் மேல் முறையீடு FAA முடிவின் 90 நாட்களுக்குள் தாக்கல் செய்யவும்.' },
      ],
    },

    penalty: {
      title: 'விதிமீறலுக்கான அபராதங்கள்',
      icon: '⚖️',
      items: [
        'தாமதத்திற்கு ₹250 தினசரி அபராதம் — கால வரம்பை மீறும் ஒவ்வொரு நாளுக்கும்',
        'அதிகபட்ச அபராதம்: ₹25,000 — தகவல் ஆணையத்தால் விதிக்கப்படலாம்',
        'கட்டளை மீறும் PIO க்கு ஒழுங்கு நடவடிக்கை பரிந்துரைக்கப்படலாம்',
        'தவறான, முழுமையற்ற அல்லது திரிசுடான தகவல் வழங்குவது தண்டனைக்குரியது',
        'RTI விண்ணப்பத்தை தடுப்பதும் சட்டமீறல் ஆகும்',
      ],
    },

    fees: {
      title: 'கட்டண விவரங்கள்',
      icon: '💰',
      rows: [
        { item: 'விண்ணப்பக் கட்டணம் (மத்திய அரசு)', amount: '₹10' },
        { item: 'விண்ணப்பக் கட்டணம் (தமிழ்நாடு மாநில அரசு)', amount: '₹10' },
        { item: 'நகல் கட்டணம் (ஒரு பக்கம் A4/A3)', amount: '₹2' },
        { item: 'ஃபிளாபி / CD / DVD', amount: '₹50' },
        { item: 'ஆவண ஆய்வு (முதல் மணி நேரம்)', amount: 'இலவசம்' },
        { item: 'ஆவண ஆய்வு (அடுத்த ஒவ்வொரு மணி நேரம்)', amount: '₹5' },
        { item: 'வறுமை ரேகைக்கு கீழ் உள்ளவர்கள் (BPL சான்றிதழுடன்)', amount: 'முழு விலக்கு' },
      ],
    },

    usecases: {
      title: 'RTI இன் பொதுவான பயன்பாடுகள்',
      icon: '💡',
      items: [
        'ரேஷன் கார்டு, ஓய்வூதியம் அல்லது உதவித்தொகை விண்ணப்பத்தின் நிலையை சரிபார்க்க',
        'சாலைகள், வடிகால்கள் அல்லது அரசு திட்டங்களுக்கு பொது நிதி எவ்வாறு செலவிடப்பட்டது என்று அறிய',
        'அரசு ஊழியர் நியமனம் சரியாக நடந்ததா என்று சரிபார்க்க',
        'சொத்து பதிவு அல்லது நில பதிவு மாற்றத்தில் ஏற்படும் தாமதங்களை கண்காணிக்க',
        'மக்கள் பிரதிநிதிகள் அல்லது நியமிக்கப்பட்ட அதிகாரிகளின் தகுதிகளை அறிய',
        'உங்கள் பகுதியில் நடக்கும் திட்டங்களின் சுற்றுச்சூழல் அனுமதி ஆவணங்களை பார்க்க',
        'PM Awas, MGNREGS போன்ற நலத்திட்டங்களின் பயனாளிகளின் எண்ணிக்கையை சரிபார்க்க',
        'காவல் துறை அல்லது உள்ளாட்சி அமைப்பில் தாக்கல் செய்த புகாரின் நடவடிக்கையை அறிய',
      ],
    },

    contact: {
      title: 'தமிழ்நாட்டில் முக்கிய தொடர்பு விவரங்கள்',
      items: [
        { label: 'தமிழ்நாடு மாநில தகவல் ஆணையம் (TNSIC)', value: 'எண். 3, தியாகராய சாலை, தி. நகர், சென்னை - 600017' },
        { label: 'TNSIC உதவி எண்', value: '044-24333610' },
        { label: 'RTI ஆன்லைன் போர்ட்டல் (மத்திய)', value: 'https://rtionline.gov.in' },
        { label: 'மத்திய தகவல் ஆணையம் (CIC)', value: 'Auguste Helard Marg, New Delhi - 110001' },
      ],
    },
  },
};

export default function RTIAwareness() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const c = CONTENT[lang] || CONTENT['en'];

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar backTo="/dashboard" backLabel={t(lang, 'dashboard')} />

      <div className="page-wrap max-w-5xl mx-auto space-y-6">
        <section className="portal-hero fade-in">
          <div className="portal-hero-content">
            <div className="portal-kicker">
              <span className="portal-kicker-dot" />
              RTI Awareness
            </div>
            <h2 className="mt-5 text-3xl md:text-4xl font-extrabold leading-tight">{c.pageTitle}</h2>
            <p className="mt-3 text-blue-100 leading-7 max-w-3xl">{c.pageSubtitle}</p>
          </div>
        </section>

        {/* What is RTI */}
        <div className="portal-panel p-6 fade-in">
          <h3 className="font-bold text-[#1a3a6b] text-base mb-3 flex items-center gap-2">
            <span className="w-10 h-10 rounded-xl bg-blue-100 text-[#1a3a6b] flex items-center justify-center text-xs font-bold">RTI</span> {c.what.title}
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed mb-4">{c.what.body}</p>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {c.what.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-blue-800">
                <span className="text-orange-500 font-bold flex-shrink-0">✦</span> {h}
              </div>
            ))}
          </div>
        </div>

        {/* Why RTI */}
        <div className="portal-panel p-6 fade-in">
          <h3 className="font-bold text-[#1a3a6b] text-base mb-4 flex items-center gap-2">
            <span className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold">WHY</span> {c.why.title}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {c.why.points.map((p, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-orange-500 font-bold text-lg mt-0.5 flex-shrink-0">✦</span>
                <div>
                  <p className="font-semibold text-sm text-[#1a3a6b]">{p.title}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scope */}
        <div className="portal-panel p-6 fade-in">
          <h3 className="font-bold text-[#1a3a6b] text-base mb-4 flex items-center gap-2">
            <span className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">SCOPE</span> {c.scope.title}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <h4 className="font-semibold text-green-700 text-sm mb-3">
                ✓ {lang === 'en' ? 'Covered (Public Authorities)' : 'உள்ளடங்கும் அமைப்புகள்'}
              </h4>
              <ul className="space-y-1.5">
                {c.scope.covered.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-700 text-sm mb-3">
                ✗ {lang === 'en' ? 'Exempted / Not Covered' : 'விலக்கு அளிக்கப்பட்டவை'}
              </h4>
              <ul className="space-y-1.5">
                {c.scope.excluded.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-red-500 flex-shrink-0 mt-0.5">✗</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Rights */}
        <div className="portal-panel p-6 fade-in">
          <h3 className="font-bold text-[#1a3a6b] text-base mb-4 flex items-center gap-2">
            <span className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">RIGHTS</span> {c.rights.title}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {c.rights.items.map((r, i) => (
              <div key={i} className="border-l-4 border-orange-400 pl-3 py-1">
                <p className="font-semibold text-sm text-slate-800">{r.title}</p>
                <p className="text-xs text-slate-600 mt-0.5">{r.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="portal-panel p-6 fade-in">
          <h3 className="font-bold text-[#1a3a6b] text-base mb-4 flex items-center gap-2">
            <span className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold">TIME</span> {c.timeline.title}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: '#1a3a6b' }}>
                  <th className="px-4 py-3 text-left text-white text-xs font-semibold uppercase tracking-wider">
                    {lang === 'en' ? 'Time Limit' : 'கால வரம்பு'}
                  </th>
                  <th className="px-4 py-3 text-left text-white text-xs font-semibold uppercase tracking-wider">
                    {lang === 'en' ? 'Type' : 'வகை'}
                  </th>
                  <th className="px-4 py-3 text-left text-white text-xs font-semibold uppercase tracking-wider">
                    {lang === 'en' ? 'Description' : 'விளக்கம்'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {c.timeline.items.map((t, i) => (
                  <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                    <td className="px-4 py-3 font-bold text-orange-600 text-sm whitespace-nowrap">{t.days}</td>
                    <td className="px-4 py-3 font-semibold text-[#1a3a6b] text-sm">{t.label}</td>
                    <td className="px-4 py-3 text-slate-600 text-sm">{t.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Penalty + Fees side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 fade-in">
          <div className="portal-panel p-5">
            <h3 className="font-bold text-[#1a3a6b] text-sm mb-3 flex items-center gap-2">
              <span className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold">LAW</span> {c.penalty.title}
            </h3>
            <ul className="space-y-2">
              {c.penalty.items.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-red-500 flex-shrink-0 mt-0.5">!</span> {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="portal-panel p-5">
            <h3 className="font-bold text-[#1a3a6b] text-sm mb-3 flex items-center gap-2">
              <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">FEE</span> {c.fees.title}
            </h3>
            <table className="w-full">
              <tbody>
                {c.fees.rows.map((r, i) => (
                  <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? '' : 'bg-slate-50'}`}>
                    <td className="py-1.5 text-xs text-slate-700">{r.item}</td>
                    <td className="py-1.5 text-xs font-bold text-green-700 text-right whitespace-nowrap pl-2">{r.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Use Cases */}
        <div className="portal-panel p-6 fade-in">
          <h3 className="font-bold text-[#1a3a6b] text-base mb-4 flex items-center gap-2">
            <span className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">USE</span> {c.usecases.title}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {c.usecases.items.map((u, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-orange-500 font-bold flex-shrink-0 mt-0.5">•</span> {u}
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="portal-panel p-6 fade-in">
          <h3 className="font-bold text-[#1a3a6b] text-base mb-4 flex items-center gap-2">
            <span className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold">HELP</span> {c.contact.title}
          </h3>
          <div className="space-y-3">
            {c.contact.items.map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 py-2 border-b border-slate-100 last:border-0">
                <span className="font-semibold text-sm text-slate-700 sm:w-72 flex-shrink-0">{item.label}</span>
                <span className="text-sm text-[#1a3a6b]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="portal-hero fade-in">
          <div className="portal-hero-content flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-white">
              <p className="font-bold text-base">{lang === 'en' ? 'Know your rights. Use them.' : 'உங்கள் உரிமைகளை அறிந்துகொள்ளுங்கள். அவற்றை பயன்படுத்துங்கள்.'}</p>
              <p className="text-blue-200 text-sm mt-0.5">{lang === 'en' ? 'File an RTI today and hold the government accountable.' : 'இன்றே RTI தாக்கல் செய்து அரசை பொறுப்பாக வைத்திருங்கள்.'}</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button onClick={() => navigate('/rti-guide')} className="btn-secondary text-sm py-2">
                {lang === 'en' ? 'How to File →' : 'எப்படி தாக்கல் செய்வது →'}
              </button>
              <button onClick={() => navigate('/file-rti')} className="btn-saffron text-sm py-2">
                {lang === 'en' ? 'File RTI Now' : 'RTI தாக்கல் செய்யுங்கள்'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
