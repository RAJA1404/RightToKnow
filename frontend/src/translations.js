/**
 * translations.js
 * All UI strings for English and Tamil.
 * Usage: const { lang } = useLanguage(); const text = t(lang, 'key');
 */

const translations = {

  /* ─── COMMON / SHARED ────────────────────────────────── */
  govHeader: {
    en: 'Government of Tamil Nadu  |  Right to Information Portal',
    ta: 'தமிழ்நாடு அரசு  |  தகவல் அறியும் உரிமைச் சட்ட வலைதளம்',
  },
  portalName: {
    en: 'RightToKnow',
    ta: 'RightToKnow',
  },
  portalTagline: {
    en: 'Tamil Nadu Right to Information Portal',
    ta: 'தமிழ்நாடு தகவல் அறியும் உரிமை வலைதளம்',
  },
  copyright: {
    en: '© 2025 Government of Tamil Nadu · RTI Online Portal',
    ta: '© 2025 தமிழ்நாடு அரசு · RTI ஆன்லைன் வலைதளம்',
  },
  loading: {
    en: 'Loading...',
    ta: 'ஏற்றுகிறது...',
  },
  back: {
    en: 'Back',
    ta: 'திரும்பு',
  },

  /* ─── NAVBAR ────────────────────────────────────────── */
  loggedInAs: {
    en: 'Logged in as',
    ta: 'உள்நுழைந்தவர்',
  },
  logout: {
    en: 'Logout',
    ta: 'வெளியேறு',
  },
  notifications: {
    en: 'Notifications',
    ta: 'அறிவிப்புகள்',
  },
  markAllRead: {
    en: 'Mark all read',
    ta: 'அனைத்தும் படிக்கப்பட்டது',
  },
  noNotifications: {
    en: 'No notifications',
    ta: 'அறிவிப்புகள் இல்லை',
  },

  /* ─── LOGIN ──────────────────────────────────────────── */
  citizenLogin: {
    en: 'Citizen Login',
    ta: 'குடிமக்கள் உள்நுழைவு',
  },
  loginTitle: {
    en: 'Citizen / Admin Login',
    ta: 'குடிமக்கள் / நிர்வாகி உள்நுழைவு',
  },
  loginSubtitle: {
    en: 'Sign in to access your RTI account',
    ta: 'உங்கள் RTI கணக்கை அணுக உள்நுழையவும்',
  },
  mainAdminLogin: {
    en: 'Portal Admin Login',
    ta: 'முக்கிய நிர்வாகி உள்நுழைவு',
  },
  mainAdminLoginSubtitle: {
    en: 'Sign in as the central admin to review and assign RTIs across departments',
    ta: 'துறைகள் முழுவதும் RTI களை பரிசீலித்து ஒதுக்க முக்கிய நிர்வாகியாக உள்நுழையவும்',
  },
  sharedLoginHelper: {
    en: 'Citizens, PIOs, department heads, and portal administrators all use this sign-in page.',
    ta: 'குடிமக்கள், முக்கிய நிர்வாகிகள், துறை நிர்வாகிகள், மற்றும் சூப்பர் நிர்வாகிகள் அனைவரும் இதே உள்நுழைவு பக்கத்தை பயன்படுத்துகின்றனர்.',
  },
  mainAdminLoginHelper: {
    en: 'Use your portal administrator email and password here to access central assignment controls.',
    ta: 'மத்திய ஒதுக்கீட்டு பேனலை அணுக உங்கள் முக்கிய நிர்வாகி மின்னஞ்சல் மற்றும் கடவுச்சொல்லை இங்கே பயன்படுத்தவும்.',
  },
  deptHeadLogin: {
    en: 'Department Head Login',
    ta: 'துறைத் தலைவர் உள்நுழைவு',
  },
  deptHeadLoginSubtitle: {
    en: 'Sign in as a department head to review RTIs and appeals routed to your department',
    ta: 'முக்கிய நிர்வாகி ஒதுக்கிய RTI மற்றும் மேல்முறையீடுகளை பரிசீலிக்க துறைத் தலைவராக உள்நுழையவும்',
  },
  deptHeadLoginHelper: {
    en: 'Use your department admin credentials here to process cases assigned to your department.',
    ta: 'உங்கள் துறைக்கு ஒதுக்கப்பட்ட வழக்குகளை செயல்படுத்த துறை நிர்வாகி அங்கீகாரங்களை இங்கே பயன்படுத்தவும்.',
  },
  emailAddress: {
    en: 'Email Address',
    ta: 'மின்னஞ்சல் முகவரி',
  },
  emailPlaceholder: {
    en: 'Enter your registered email',
    ta: 'பதிவு செய்த மின்னஞ்சலை உள்ளிடவும்',
  },
  password: {
    en: 'Password',
    ta: 'கடவுச்சொல்',
  },
  passwordPlaceholder: {
    en: 'Enter your password',
    ta: 'உங்கள் கடவுச்சொல்லை உள்ளிடவும்',
  },
  forgotPasswordLink: {
    en: 'Forgot password?',
    ta: 'கடவுச்சொல் மறந்துவிட்டதா?',
  },
  forgotPasswordTitle: {
    en: 'Forgot Password',
    ta: 'கடவுச்சொல்லை மீட்டமைக்கவும்',
  },
  forgotPasswordSubtitle: {
    en: 'Enter your registered email to generate a password reset link',
    ta: 'கடவுச்சொல் மீட்டமைப்பு இணைப்பை உருவாக்க உங்கள் பதிவு செய்யப்பட்ட மின்னஞ்சலை உள்ளிடவும்',
  },
  sendResetLink: {
    en: 'Send Reset Link',
    ta: 'மீட்டமைப்பு இணைப்பை அனுப்பவும்',
  },
  devResetLink: {
    en: 'Development reset link',
    ta: 'உருவாக்க நிலை மீட்டமைப்பு இணைப்பு',
  },
  backToLogin: {
    en: 'Back to Login',
    ta: 'உள்நுழைவுக்கு திரும்பவும்',
  },
  resetPasswordTitle: {
    en: 'Reset Password',
    ta: 'கடவுச்சொல்லை மாற்றவும்',
  },
  resetPasswordSubtitle: {
    en: 'Choose a new password for your account',
    ta: 'உங்கள் கணக்குக்கு புதிய கடவுச்சொல்லை தேர்வு செய்யவும்',
  },
  newPassword: {
    en: 'New Password',
    ta: 'புதிய கடவுச்சொல்',
  },
  confirmPassword: {
    en: 'Confirm Password',
    ta: 'கடவுச்சொல்லை உறுதிப்படுத்தவும்',
  },
  resetPasswordBtn: {
    en: 'Reset Password',
    ta: 'கடவுச்சொல்லை மாற்றவும்',
  },
  invalidResetLink: {
    en: 'This reset link is invalid or incomplete.',
    ta: 'இந்த மீட்டமைப்பு இணைப்பு தவறானது அல்லது முழுமையற்றது.',
  },
  passwordMismatch: {
    en: 'Passwords do not match.',
    ta: 'கடவுச்சொற்கள் பொருந்தவில்லை.',
  },
  signIn: {
    en: 'Sign In',
    ta: 'உள்நுழைக',
  },
  signingIn: {
    en: 'Signing In...',
    ta: 'உள்நுழைகிறது...',
  },
  noAccount: {
    en: "Don't have an account?",
    ta: 'கணக்கு இல்லையா?',
  },
  registerHere: {
    en: 'Register here',
    ta: 'இங்கே பதிவு செய்யவும்',
  },

  /* ─── REGISTER ───────────────────────────────────────── */
  citizenRegistration: {
    en: 'Citizen Registration',
    ta: 'குடிமக்கள் பதிவு',
  },
  registerSubtitle: {
    en: 'Create your account to file RTI applications online',
    ta: 'RTI விண்ணப்பங்களை ஆன்லைனில் தாக்கல் செய்ய உங்கள் கணக்கை உருவாக்கவும்',
  },
  firstName: {
    en: 'First Name',
    ta: 'முதல் பெயர்',
  },
  firstNamePlaceholder: {
    en: 'First name',
    ta: 'முதல் பெயர்',
  },
  lastName: {
    en: 'Last Name',
    ta: 'கடைசி பெயர்',
  },
  lastNamePlaceholder: {
    en: 'Last name',
    ta: 'கடைசி பெயர்',
  },
  emailPlaceholderReg: {
    en: 'Enter email address',
    ta: 'மின்னஞ்சல் முகவரியை உள்ளிடவும்',
  },
  passwordCreate: {
    en: 'Password',
    ta: 'கடவுச்சொல்',
  },
  passwordCreatePlaceholder: {
    en: 'Create a strong password',
    ta: 'வலுவான கடவுச்சொல்லை உருவாக்கவும்',
  },
  mobileNumber: {
    en: 'Mobile Number',
    ta: 'கைபேசி எண்',
  },
  mobilePlaceholder: {
    en: '+91 9876543210',
    ta: '+91 9876543210',
  },
  residentialAddress: {
    en: 'Residential Address',
    ta: 'வசிப்பிட முகவரி',
  },
  addressPlaceholder: {
    en: 'Full residential address',
    ta: 'முழு வசிப்பிட முகவரி',
  },
  aadhaarNumber: {
    en: 'Aadhaar Number',
    ta: 'ஆதார் எண்',
  },
  aadhaarPlaceholder: {
    en: '12-digit Aadhaar number',
    ta: '12 இலக்க ஆதார் எண்',
  },
  aadhaarHelper: {
    en: 'Your Aadhaar is required for identity verification',
    ta: 'அடையாள சரிபார்ப்புக்கு உங்கள் ஆதார் தேவை',
  },
  register: {
    en: 'Register',
    ta: 'பதிவு செய்க',
  },
  registering: {
    en: 'Registering...',
    ta: 'பதிவு செய்கிறது...',
  },
  registrationSuccess: {
    en: 'Registration Successful!',
    ta: 'பதிவு வெற்றிகரமாக முடிந்தது!',
  },
  redirectingToLogin: {
    en: 'Redirecting to login page...',
    ta: 'உள்நுழைவு பக்கத்திற்கு திருப்பி விடுகிறது...',
  },
  alreadyRegistered: {
    en: 'Already registered?',
    ta: 'ஏற்கனவே பதிவு செய்தீர்களா?',
  },
  loginHere: {
    en: 'Login here',
    ta: 'இங்கே உள்நுழையவும்',
  },

  /* ─── DASHBOARD ──────────────────────────────────────── */
  welcome: {
    en: 'Welcome',
    ta: 'வரவேற்கிறோம்',
  },
  dashboardTagline: {
    en: 'Tamil Nadu RTI Citizen Portal — Overview',
    ta: 'தமிழ்நாடு RTI குடிமக்கள் வலைதளம் — கண்ணோட்டம்',
  },
  totalApplications: {
    en: 'Total Applications',
    ta: 'மொத்த விண்ணப்பங்கள்',
  },
  pending: {
    en: 'Pending',
    ta: 'நிலுவையில் உள்ளது',
  },
  responded: {
    en: 'Responded',
    ta: 'பதிலளிக்கப்பட்டது',
  },
  quickActions: {
    en: 'Quick Actions',
    ta: 'விரைவு செயல்கள்',
  },
  fileNewRTI: {
    en: 'File New RTI Application',
    ta: 'புதிய RTI விண்ணப்பம் தாக்கல் செய்க',
  },
  viewMyApplications: {
    en: 'View My Applications',
    ta: 'என் விண்ணப்பங்களை காண்க',
  },
  howToFileRTI: {
    en: 'How to File RTI',
    ta: 'RTI எப்படி தாக்கல் செய்வது',
  },
  howToFileRTIDesc: {
    en: 'Step-by-step guide to filing your RTI application — in',
    ta: 'RTI விண்ணப்பம் தாக்கல் செய்ய படிப்படியான வழிகாட்டி —',
  },
  readGuide: {
    en: 'Read Guide →',
    ta: 'வழிகாட்டியை படிக்க →',
  },
  rtiAwareness: {
    en: 'RTI Awareness',
    ta: 'RTI விழிப்புணர்வு',
  },
  rtiAwarenessDesc: {
    en: 'Know your rights, RTI Act provisions, exemptions, penalties & more — in',
    ta: 'உங்கள் உரிமைகளை அறியுங்கள், RTI சட்ட விதிகள், விலக்குகள், அபராதங்கள் மற்றும் மேலும் —',
  },
  learnMore: {
    en: 'Learn More →',
    ta: 'மேலும் அறிய →',
  },
  importantNotice: {
    en: '📢 Important Notice',
    ta: '📢 முக்கிய அறிவிப்பு',
  },
  importantNoticeText: {
    en: 'As per the RTI Act 2005, the Public Information Officer is required to provide the information within 30 days of receipt of RTI application.',
    ta: 'RTI சட்டம் 2005 இன்படி, RTI விண்ணப்பம் கிடைத்த 30 நாட்களுக்குள் பொதுத் தகவல் அதிகாரி தகவலை வழங்க வேண்டும்.',
  },

  /* ─── FILE RTI ───────────────────────────────────────── */
  fileRTI: {
    en: 'File RTI Application',
    ta: 'RTI விண்ணப்பம் தாக்கல் செய்க',
  },
  fileRTISubtitle: {
    en: 'Submit your Right to Information request online',
    ta: 'உங்கள் தகவல் அறியும் உரிமை கோரிக்கையை ஆன்லைனில் சமர்ப்பிக்கவும்',
  },
  guestFilingNotice: {
    en: 'Filing as a Guest. You will use your email and application number to track status.',
    ta: 'விருந்தினராக தாக்கல் செய்கிறீர்கள். நிலையை கண்காணிக்க உங்கள் மின்னஞ்சல் மற்றும் விண்ணப்ப எண்ணைப் பயன்படுத்துவீர்கள்.',
  },
  guestEmail: {
    en: 'Email Address',
    ta: 'மின்னஞ்சல் முவரி',
  },
  guestMobile: {
    en: 'Mobile Number',
    ta: 'கைபேசி எண்',
  },
  fileRtiNav: {
    en: 'File RTI',
    ta: 'RTI தாக்கல்',
  },
  guestSuccessRedirect: {
    en: 'RTI Filed Successfully! Application No: {no}. Redirecting to track status...',
    ta: 'RTI வெற்றிகரமாக தாக்கல் செய்யப்பட்டது! விண்ணப்ப எண்: {no}. நிலை கண்காணிக்க திருப்பி விடுகிறது...',
  },
  district: {
    en: 'District',
    ta: 'மாவட்டம்',
  },
  selectDistrict: {
    en: '— Select District —',
    ta: '— மாவட்டம் தேர்ந்தெடுக்கவும் —',
  },
  department: {
    en: 'Department',
    ta: 'துறை',
  },
  selectDepartment: {
    en: '— Select Department —',
    ta: '— துறை தேர்ந்தெடுக்கவும் —',
  },
  subject: {
    en: 'Subject',
    ta: 'தலைப்பு',
  },
  subjectPlaceholder: {
    en: 'Brief subject of your RTI request',
    ta: 'உங்கள் RTI கோரிக்கையின் சுருக்கமான தலைப்பு',
  },
  description: {
    en: 'Description / RTI Request',
    ta: 'விளக்கம் / RTI கோரிக்கை',
  },
  descriptionPlaceholder: {
    en: 'Describe your RTI request in detail. Be specific about the information you are seeking.',
    ta: 'உங்கள் RTI கோரிக்கையை விரிவாக விவரிக்கவும். நீங்கள் தேடும் தகவலை குறிப்பாக கூறவும்.',
  },
  descriptionHelper: {
    en: 'Be precise and specific about the information sought. This helps in faster processing.',
    ta: 'தேவைப்படும் தகவலை துல்லியமாகவும் குறிப்பாகவும் கூறவும். இது விரைவான செயலாக்கத்திற்கு உதவும்.',
  },
  supportingDocument: {
    en: 'Supporting Document',
    ta: 'துணை ஆவணம்',
  },
  optional: {
    en: '(Optional)',
    ta: '(விருப்பத்தேர்வு)',
  },
  clickToUpload: {
    en: 'Click to upload',
    ta: 'பதிவேற்ற கிளிக் செய்யவும்',
  },
  submitRTI: {
    en: 'Submit RTI Application',
    ta: 'RTI விண்ணப்பம் சமர்ப்பிக்கவும்',
  },
  submitting: {
    en: 'Submitting...',
    ta: 'சமர்ப்பிக்கிறது...',
  },
  cancel: {
    en: 'Cancel',
    ta: 'ரத்து செய்க',
  },

  /* ─── MY APPLICATIONS ────────────────────────────────── */
  myApplications: {
    en: 'My RTI Applications',
    ta: 'என் RTI விண்ணப்பங்கள்',
  },
  myApplicationsSubtitle: {
    en: 'Status of all your filed RTI requests',
    ta: 'தாக்கல் செய்யப்பட்ட அனைத்து RTI கோரிக்கைகளின் நிலை',
  },
  fileNewRTIBtn: {
    en: 'File New RTI',
    ta: 'புதிய RTI தாக்கல்',
  },
  loadingApplications: {
    en: 'Loading applications...',
    ta: 'விண்ணப்பங்கள் ஏற்றப்படுகின்றன...',
  },
  noApplicationsFound: {
    en: 'No Applications Found',
    ta: 'விண்ணப்பங்கள் எதுவும் இல்லை',
  },
  noApplicationsYet: {
    en: 'You have not filed any RTI applications yet.',
    ta: 'நீங்கள் இன்னும் எந்த RTI விண்ணப்பமும் தாக்கல் செய்யவில்லை.',
  },
  fileFirstRTI: {
    en: 'File Your First RTI',
    ta: 'உங்கள் முதல் RTI ஐ தாக்கல் செய்க',
  },
  applicationNo: {
    en: 'Application No.',
    ta: 'விண்ணப்ப எண்.',
  },
  tableSubject: {
    en: 'Subject',
    ta: 'தலைப்பு',
  },
  tableDistrict: {
    en: 'District',
    ta: 'மாவட்டம்',
  },
  tableDateFiled: {
    en: 'Date Filed',
    ta: 'தாக்கல் தேதி',
  },
  tableStatus: {
    en: 'Status',
    ta: 'நிலை',
  },
  tableAction: {
    en: 'Action',
    ta: 'செயல்',
  },
  track: {
    en: 'Track →',
    ta: 'கண்காணி →',
  },

  /* ─── TRACK STATUS ───────────────────────────────────── */
  applicationStatus: {
    en: 'Application Status',
    ta: 'விண்ணப்ப நிலை',
  },
  trackSubtitle: {
    en: 'Track the progress of your RTI request',
    ta: 'உங்கள் RTI கோரிக்கையின் முன்னேற்றத்தை கண்காணிக்கவும்',
  },
  publicTrackTitle: {
    en: 'Track RTI Application Status',
    ta: 'RTI விண்ணப்ப நிலையை கண்காணிக்கவும்',
  },
  publicTrackSubtitle: {
    en: 'Enter your Application Number and registered Email to check the status. No login required.',
    ta: 'நிலையை சரிபார்க்க உங்கள் விண்ணப்ப எண் மற்றும் பதிவு செய்த மின்னஞ்சலை உள்ளிடவும். உள்நுழைவு தேவையில்லை.',
  },
  enterApplicationNo: {
    en: 'Application Number',
    ta: 'விண்ணப்ப எண்',
  },
  enterApplicationNoPlaceholder: {
    en: 'e.g. RTI-2025-00123',
    ta: 'எ.கா. RTI-2025-00123',
  },
  trackBtn: {
    en: 'Track Status',
    ta: 'நிலையை கண்காணி',
  },
  searchingStatus: {
    en: 'Searching...',
    ta: 'தேடுகிறது...',
  },
  trackAnotherApp: {
    en: '← Track Another Application',
    ta: '← மற்றொரு விண்ணப்பத்தை கண்காணி',
  },
  trackStatusNav: {
    en: 'Track Status',
    ta: 'நிலை காண்க',
  },
  trackWithoutLogin: {
    en: 'Track your application without logging in →',
    ta: 'உள்நுழையாமல் உங்கள் விண்ணப்பத்தை கண்காணிக்கவும் →',
  },
  applicationDetails: {
    en: 'Application Details',
    ta: 'விண்ணப்ப விவரங்கள்',
  },
  applicationNumber: {
    en: 'Application Number',
    ta: 'விண்ணப்ப எண்',
  },
  fieldDistrict: {
    en: 'District',
    ta: 'மாவட்டம்',
  },
  fieldSubject: {
    en: 'Subject',
    ta: 'தலைப்பு',
  },
  filedOn: {
    en: 'Filed On',
    ta: 'தாக்கல் செய்த தேதி',
  },
  currentStatus: {
    en: 'Current Status',
    ta: 'தற்போதைய நிலை',
  },
  processingTimeline: {
    en: 'Processing Timeline',
    ta: 'செயலாக்க காலவரிசை',
  },
  updateHistory: {
    en: 'Update History',
    ta: 'புதுப்பிப்பு வரலாறு',
  },
  noUpdatesYet: {
    en: 'No updates recorded yet.',
    ta: 'இன்னும் புதுப்பிப்புகள் பதிவு செய்யப்படவில்லை.',
  },
  applicationNotFound: {
    en: 'Application not found.',
    ta: 'விண்ணப்பம் கிடைக்கவில்லை.',
  },

  /* ─── STATUS LABELS ──────────────────────────────────── */
  statusSubmitted: {
    en: 'SUBMITTED',
    ta: 'சமர்ப்பிக்கப்பட்டது',
  },
  statusReceived: {
    en: 'RECEIVED',
    ta: 'பெறப்பட்டது',
  },
  statusInProgress: {
    en: 'IN PROGRESS',
    ta: 'செயல்பாட்டில்',
  },
  statusResponded: {
    en: 'RESPONDED',
    ta: 'பதிலளிக்கப்பட்டது',
  },
  statusClosed: {
    en: 'CLOSED',
    ta: 'மூடப்பட்டது',
  },

  /* ─── DASHBOARD (NAV LABELS for back button) ─────────── */
  dashboard: {
    en: 'Dashboard',
    ta: 'முகப்பு',
  },
  myApplicationsNav: {
    en: 'My Applications',
    ta: 'என் விண்ணப்பங்கள்',
  },

  /* ─── NOTIFY (GOV TOPBAR) ────────────────────────────── */
  govTopbar: {
    en: 'Government of Tamil Nadu · Right to Information Portal',
    ta: 'தமிழ்நாடு அரசு · தகவல் அறியும் உரிமைச் சட்ட வலைதளம்',
  },

  /* ─── FIRST APPEAL ──────────────────────────────────── */
  firstAppeal: {
    en: 'First Appeal (Section 19)',
    ta: 'முதல் மேல்முறையீடு (பிரிவு 19)',
  },
  firstAppealSubtitle: {
    en: 'File a First Appeal if unsatisfied with the RTI response within 30 days',
    ta: 'RTI பதிலில் திருப்தியடையவில்லை என்றால் 30 நாட்களுக்குள் முதல் மேல்முறையீடு தாக்கல் செய்யவும்',
  },
  fileAppealTab: {
    en: 'File Appeal',
    ta: 'மேல்முறையீடு தாக்கல்',
  },
  myAppealsTab: {
    en: 'My Appeals',
    ta: 'என் மேல்முறையீடுகள்',
  },
  appealInfoTitle: {
    en: 'About First Appeal (RTI Act Section 19)',
    ta: 'முதல் மேல்முறையீடு பற்றி (RTI சட்டம் பிரிவு 19)',
  },
  appealInfoText: {
    en: 'If you are not satisfied with the response or if no response was received within 30 days, you can file a First Appeal to the First Appellate Authority within 30 days of receipt of the response.',
    ta: 'பதிலில் திருப்தியடையவில்லை அல்லது 30 நாட்களுக்குள் பதில் பெறவில்லை என்றால், பதில் பெற்ற 30 நாட்களுக்குள் முதல் மேல்முறையீட்டு அதிகாரியிடம் முதல் மேல்முறையீடு தாக்கல் செய்யலாம்.',
  },
  selectApplication: {
    en: 'Select Application to Appeal',
    ta: 'மேல்முறையீட்டிற்கான விண்ணப்பத்தை தேர்ந்தெடுக்கவும்',
  },
  selectAppPlaceholder: {
    en: '— Select an application —',
    ta: '— ஒரு விண்ணப்பத்தை தேர்ந்தெடுக்கவும் —',
  },
  appealReason: {
    en: 'Reason for Appeal',
    ta: 'மேல்முறையீட்டிற்கான காரணம்',
  },
  appealReasonPlaceholder: {
    en: 'Explain why you are filing this appeal. Describe what was unsatisfactory in the response or why the information provided was incomplete.',
    ta: 'இந்த மேல்முறையீட்டை ஏன் தாக்கல் செய்கிறீர்கள் என்பதை விளக்கவும். பதிலில் திருப்தியில்லாத அம்சங்களை விவரிக்கவும்.',
  },
  appealReasonHelper: {
    en: 'Be specific about what information was denied, delayed, or inadequately provided.',
    ta: 'எந்த தகவல் மறுக்கப்பட்டது, தாமதமானது அல்லது போதுமான அளவில் வழங்கப்படாதது என்பதை குறிப்பாக கூறவும்.',
  },
  appealDocument: {
    en: 'Supporting Document for Appeal',
    ta: 'மேல்முறையீட்டிற்கான துணை ஆவணம்',
  },
  submitAppeal: {
    en: 'Submit First Appeal',
    ta: 'முதல் மேல்முறையீட்டை சமர்ப்பிக்கவும்',
  },
  appealSuccess: {
    en: 'First Appeal filed successfully!',
    ta: 'முதல் மேல்முறையீடு வெற்றிகரமாக தாக்கல் செய்யப்பட்டது!',
  },
  appealError: {
    en: 'Failed to file appeal. Please try again.',
    ta: 'மேல்முறையீட்டை தாக்கல் செய்ய முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
  },
  noEligibleApps: {
    en: 'No Eligible Applications',
    ta: 'தகுதியான விண்ணப்பங்கள் இல்லை',
  },
  noEligibleAppsInfo: {
    en: 'Only applications with RESPONDED or CLOSED status are eligible for First Appeal.',
    ta: 'பதிலளிக்கப்பட்ட அல்லது மூடப்பட்ட நிலையில் உள்ள விண்ணப்பங்கள் மட்டுமே முதல் மேல்முறையீட்டிற்கு தகுதியானவை.',
  },
  noAppeals: {
    en: 'No Appeals Filed',
    ta: 'மேல்முறையீடுகள் தாக்கல் செய்யப்படவில்லை',
  },
  noAppealsYet: {
    en: 'You have not filed any First Appeals yet.',
    ta: 'நீங்கள் இன்னும் எந்த முதல் மேல்முறையீடும் தாக்கல் செய்யவில்லை.',
  },
  fileFirstAppeal: {
    en: 'File Your First Appeal',
    ta: 'உங்கள் முதல் மேல்முறையீட்டை தாக்கல் செய்க',
  },
  appealReasonCol: {
    en: 'Reason',
    ta: 'காரணம்',
  },
  disposalRemarks: {
    en: 'Remarks',
    ta: 'கருத்துகள்',
  },
  appealFiled: {
    en: 'FILED',
    ta: 'தாக்கல் செய்யப்பட்டது',
  },
  appealUnderReview: {
    en: 'UNDER REVIEW',
    ta: 'ஆய்வில் உள்ளது',
  },
  appealDisposed: {
    en: 'DISPOSED',
    ta: 'தீர்வு செய்யப்பட்டது',
  },
  firstAppealNav: {
    en: 'First Appeal',
    ta: 'முதல் மேல்முறையீடு',
  },

  /* ─── FEE PAYMENT ──────────────────────────────────── */
  feeNoticeTitle: {
    en: 'RTI Application Fee',
    ta: 'RTI விண்ணப்பக் கட்டணம்',
  },
  feeNoticeText: {
    en: 'As per RTI Act 2005, a fee of ₹10 is required for filing an RTI application. BPL card holders are exempted.',
    ta: 'RTI சட்டம் 2005 இன்படி, RTI விண்ணப்பம் தாக்கல் செய்ய ₹10 கட்டணம் தேவை. BPL அட்டைதாரர்கள் விலக்கு பெறுவார்கள்.',
  },
  paymentMode: {
    en: 'Payment Mode',
    ta: 'கட்டண முறை',
  },
  selectPaymentMode: {
    en: '— Select Payment Mode —',
    ta: '— கட்டண முறையை தேர்ந்தெடுக்கவும் —',
  },
  postalOrder: {
    en: 'Postal Order',
    ta: 'தபால் ஆணை',
  },
  demandDraft: {
    en: 'Demand Draft',
    ta: 'கோரிக்கை வரைவு',
  },
  treasuryChallan: {
    en: 'Treasury Challan',
    ta: 'கருவூல சலான்',
  },
  onlinePayment: {
    en: 'Online Payment',
    ta: 'ஆன்லைன் பணம் செலுத்துதல்',
  },
  paymentRefNo: {
    en: 'Payment Reference Number',
    ta: 'கட்டண குறிப்பு எண்',
  },
  paymentRefPlaceholder: {
    en: 'Enter payment reference/receipt number',
    ta: 'கட்டண குறிப்பு/ரசீது எண்ணை உள்ளிடவும்',
  },
  onlinePaymentTitle: {
    en: 'Online Payment',
    ta: 'ஆன்லைன் கட்டணம்',
  },
  onlinePaymentHelp: {
    en: 'Generate a secure payment reference inside the portal before filing your RTI.',
    ta: 'உங்கள் RTIயை சமர்ப்பிக்கும் முன் தளத்திலேயே பாதுகாப்பான கட்டண குறிப்பை உருவாக்கவும்.',
  },
  payNow: {
    en: 'Pay Now',
    ta: 'இப்போது செலுத்தவும்',
  },
  processingPayment: {
    en: 'Processing Payment...',
    ta: 'கட்டணம் செயலாக்கப்படுகிறது...',
  },
  paymentCompleted: {
    en: 'Payment completed successfully.',
    ta: 'கட்டணம் வெற்றிகரமாக முடிந்தது.',
  },
  bplExemption: {
    en: 'I am a BPL card holder (Fee Exempt)',
    ta: 'நான் BPL அட்டைதாரர் (கட்டண விலக்கு)',
  },
  bplCertificate: {
    en: 'Upload BPL Certificate',
    ta: 'BPL சான்றிதழை பதிவேற்றவும்',
  },
  bplFeeExempted: {
    en: 'Fee exempted for BPL card holders',
    ta: 'BPL அட்டைதாரர்களுக்கு கட்டண விலக்கு வழங்கப்படும்',
  },
  rtiSuccessTitle: {
    en: 'RTI Application filed successfully!',
    ta: 'RTI விண்ணப்பம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!',
  },

  /* ─── SLA / DEADLINE ──────────────────────────────────── */
  daysLeft: {
    en: 'Days Left',
    ta: 'மீதமுள்ள நாட்கள்',
  },
  overdue: {
    en: 'OVERDUE',
    ta: 'காலாவதி',
  },
  deadlineDate: {
    en: 'Response Deadline',
    ta: 'பதில் காலக்கெடு',
  },
  overdueWarning: {
    en: 'This application has exceeded the 30-day response deadline as per RTI Act.',
    ta: 'இந்த விண்ணப்பம் RTI சட்டத்தின் படி 30 நாள் பதில் காலக்கெடுவை மீறியுள்ளது.',
  },

  /* ─── PRINT RECEIPT ──────────────────────────────────── */
  printReceipt: {
    en: 'Print',
    ta: 'அச்சிடு',
  },
  acknowledgmentReceipt: {
    en: 'RTI Application Acknowledgment Receipt',
    ta: 'RTI விண்ணப்ப ஒப்புகை ரசீது',
  },

  /* ─── PROFILE ────────────────────────────────────────── */
  myProfile: {
    en: 'My Profile',
    ta: 'என் சுயவிவரம்',
  },
  profileSubtitle: {
    en: 'View and manage your account details',
    ta: 'உங்கள் கணக்கு விவரங்களை காணவும் மற்றும் நிர்வகிக்கவும்',
  },
  editProfile: {
    en: 'Edit Profile',
    ta: 'சுயவிவரத்தை திருத்து',
  },
  saveProfile: {
    en: 'Save Changes',
    ta: 'மாற்றங்களை சேமி',
  },
  profileSaved: {
    en: 'Profile updated successfully!',
    ta: 'சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!',
  },
  viewDocument: {
    en: 'View Document',
    ta: 'ஆவணத்தை காண்க',
  },
  downloadResponse: {
    en: 'Download Response',
    ta: 'பதிலை பதிவிறக்கவும்',
  },

  /* ─── ADMIN PANEL ──────────────────────────────────────── */
  adminTopbar: {
    en: 'Government of Tamil Nadu  |  RTI Department Admin Panel',
    ta: 'தமிழ்நாடு அரசு  |  RTI துறை நிர்வாகி பேனல்',
  },
  adminPanelLabel: {
    en: 'Department Admin Panel',
    ta: 'துறை நிர்வாகி பேனல்',
  },
  adminRTIApplications: {
    en: 'RTI Applications',
    ta: 'RTI விண்ணப்பங்கள்',
  },
  adminAllDepts: {
    en: 'All Departments',
    ta: 'அனைத்து துறைகள்',
  },
  adminSubtitle: {
    en: 'Review and update the status of citizen RTI requests assigned to your department',
    ta: 'உங்கள் துறைக்கு ஒதுக்கப்பட்ட குடிமக்கள் RTI கோரிக்கைகளின் நிலையை மதிப்பாய்வு செய்து புதுப்பிக்கவும்',
  },
  adminStatusUpdated: {
    en: 'Status updated successfully.',
    ta: 'நிலை வெற்றிகரமாக புதுப்பிக்கப்பட்டது.',
  },
  adminStatusFailed: {
    en: 'Failed to update status. Please try again.',
    ta: 'நிலையை புதுப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
  },
  adminLoadingApps: {
    en: 'Loading applications...',
    ta: 'விண்ணப்பங்கள் ஏற்றப்படுகின்றன...',
  },
  adminNoApps: {
    en: 'No applications assigned to your department.',
    ta: 'உங்கள் துறைக்கு ஒதுக்கப்பட்ட விண்ணப்பங்கள் இல்லை.',
  },
  adminCitizen: {
    en: 'Citizen',
    ta: 'குடிமகன்',
  },
  adminUpdateAction: {
    en: 'Update',
    ta: 'புதுப்பி',
  },
  adminModalTitle: {
    en: 'Update Application Status',
    ta: 'விண்ணப்ப நிலையை புதுப்பிக்கவும்',
  },
  adminNewStatus: {
    en: 'New Status',
    ta: 'புதிய நிலை',
  },
  adminSelectStatus: {
    en: '— Select New Status —',
    ta: '— புதிய நிலையை தேர்ந்தெடுக்கவும் —',
  },
  adminRemarks: {
    en: 'Official Remarks',
    ta: 'அதிகாரப்பூர்வ கருத்துகள்',
  },
  adminRemarksPlaceholder: {
    en: 'Enter official remarks or response to the citizen...',
    ta: 'குடிமகனுக்கான அதிகாரப்பூர்வ கருத்துகள் அல்லது பதிலை உள்ளிடவும்...',
  },
  adminUpdating: {
    en: 'Updating...',
    ta: 'புதுப்பிக்கிறது...',
  },
  adminUpdateBtn: {
    en: 'Update Status',
    ta: 'நிலையை புதுப்பி',
  },

  /* ─── HOME PAGE ──────────────────────────────────────── */
  adminApplicationsTab: {
    en: 'Applications',
    ta: 'விண்ணப்பங்கள்',
  },
  adminAppealsTab: {
    en: 'Appeals',
    ta: 'மேல்முறையீடுகள்',
  },
  adminAppealsTitle: {
    en: 'First Appeals',
    ta: 'முதல் மேல்முறையீடுகள்',
  },
  adminAppealsSubtitle: {
    en: 'Review and dispose first appeals assigned to your department',
    ta: 'உங்கள் துறைக்கு ஒதுக்கப்பட்ட முதல் மேல்முறையீடுகளை பரிசீலித்து தீர்வு செய்யவும்',
  },
  adminLoadingAppeals: {
    en: 'Loading appeals...',
    ta: 'மேல்முறையீடுகள் ஏற்றப்படுகின்றன...',
  },
  adminNoAppeals: {
    en: 'No appeals assigned to your department.',
    ta: 'உங்கள் துறைக்கு ஒதுக்கப்பட்ட மேல்முறையீடுகள் இல்லை.',
  },
  adminAppealModalTitle: {
    en: 'Update Appeal Status',
    ta: 'மேல்முறையீட்டு நிலையை புதுப்பிக்கவும்',
  },
  adminAppealRemarksPlaceholder: {
    en: 'Enter disposal remarks for this appeal...',
    ta: 'இந்த மேல்முறையீட்டுக்கான தீர்வு குறிப்புகளை உள்ளிடவும்...',
  },
  adminAppealUpdateBtn: {
    en: 'Update Appeal',
    ta: 'மேல்முறையீட்டை புதுப்பிக்கவும்',
  },
  adminAppealUpdated: {
    en: 'Appeal updated successfully.',
    ta: 'மேல்முறையீடு வெற்றிகரமாக புதுப்பிக்கப்பட்டது.',
  },
  adminAppealFailed: {
    en: 'Failed to update appeal. Please try again.',
    ta: 'மேல்முறையீட்டை புதுப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
  },
  adminAnalyticsTab: {
    en: 'Analytics',
    ta: 'பகுப்பாய்வு',
  },
  adminAnalyticsTitle: {
    en: 'Portal Analytics',
    ta: 'தள பகுப்பாய்வு',
  },
  adminAnalyticsSubtitle: {
    en: 'Overview of RTI and appeal activity across departments',
    ta: 'துறைகள் முழுவதும் RTI மற்றும் மேல்முறையீட்டு செயல்பாடுகளின் சுருக்கம்',
  },
  adminLoadingAnalytics: {
    en: 'Loading analytics...',
    ta: 'பகுப்பாய்வு ஏற்றப்படுகிறது...',
  },
  adminNoAnalytics: {
    en: 'Analytics data is not available.',
    ta: 'பகுப்பாய்வு தரவு இல்லை.',
  },
  uploadResponseDocument: {
    en: 'Response Document',
    ta: 'பதில் ஆவணம்',
  },
  uploadDisposalDocument: {
    en: 'Disposal Document',
    ta: 'தீர்வு ஆவணம்',
  },
  downloadDocument: {
    en: 'Download',
    ta: 'பதிவிறக்கவும்',
  },
  homeWelcome: {
    en: 'Tamil Nadu Right to Information Portal',
    ta: 'தமிழ்நாடு தகவல் அறியும் உரிமை சட்ட வலைதளம்',
  },
  homeDescription: {
    en: 'Empowering citizens with transparency. File your RTI applications online, track status easily, and exercise your right to know.',
    ta: 'குடிமக்களுக்கு வெளிப்படைத்தன்மையுடன் அதிகாரம். உங்கள் RTI விண்ணப்பங்களை ஆன்லைனில் தாக்கல் செய்யுங்கள், நிலையை எளிதாகக் கண்காணிக்கவும், அறியும் உங்கள் உரிமையைப் பயன்படுத்தவும்.',
  },
  fileRTICardTitle: {
    en: 'File RTI Online',
    ta: 'ஆன்லைனில் RTI தாக்கல் செய்க',
  },
  fileRTICardDesc: {
    en: 'Submit a new Right to Information request directly to the concerned government department.',
    ta: 'சம்பந்தப்பட்ட அரசு துறைக்கு நேரடியாக புதிய தகவல் அறியும் உரிமை கோரிக்கையை சமர்ப்பிக்கவும்.',
  },
  trackRTICardTitle: {
    en: 'Track Status',
    ta: 'நிலையை காண்க',
  },
  trackRTICardDesc: {
    en: 'Check the real-time progress and official response for your submitted RTI applications.',
    ta: 'நீங்கள் சமர்ப்பித்த RTI விண்ணப்பங்களின் நிகழ்நேர முன்னேற்றம் மற்றும் அதிகாரப்பூர்வ பதிலைக் காணவும்.',
  },
  loginCardTitle: {
    en: 'Citizen / Admin Login',
    ta: 'குடிமக்கள் / நிர்வாகி உள்நுழைவு',
  },
  loginCardDesc: {
    en: 'Login to access your dashboard, file appeals, or manage department applications.',
    ta: 'உங்கள் டாஷ்போர்டை அணுக, மேல்முறையீடுகளை தாக்கல் செய்ய அல்லது துறை விண்ணப்பங்களை நிர்வகிக்க உள்நுழையவும்.',
  },
  mainAdminLoginCardDesc: {
    en: 'Central admin reviews all new RTIs and assigns them to the correct department.',
    ta: 'முக்கிய நிர்வாகி அனைத்து புதிய RTI களையும் பரிசீலித்து சரியான துறைக்கு ஒதுக்குவார்.',
  },
  deptHeadLoginCardDesc: {
    en: 'Department heads review and process RTIs and appeals routed to their department.',
    ta: 'துறைத் தலைவர்கள் தங்கள் துறைக்கு அனுப்பப்பட்ட RTI மற்றும் மேல்முறையீடுகளை பரிசீலித்து செயல்படுத்துவார்கள்.',
  },
  homeFooterTitle: {
    en: 'What is RTI?',
    ta: 'RTI என்றால் என்ன?',
  },
  homeFooterText: {
    en: 'The Right to Information Act, 2005 mandates timely response to citizen requests for government information. It sets out the practical regime of right to information for citizens to secure access to information under the control of public authorities, in order to promote transparency and accountability in the working of every public authority.',
    ta: 'தகவல் அறியும் உரிமைச் சட்டம் 2005, அரசாங்க தகவல்களுக்கான குடிமக்களின் கோரிக்கைகளுக்கு சரியான நேரப் பதிலளிப்பதை கட்டாயமாக்குகிறது. இது அனைத்து பொது அதிகாரங்களின் செயல்பாட்டில் வெளிப்படைத்தன்மை மற்றும் பொறுப்புணர்வை ஊக்குவிப்பதற்காக, பொது அதிகாரங்களின் கட்டுப்பாட்டில் உள்ள தகவல்களை அணுகும் குடிமக்களுக்கான நடைமுறை விதிகளை அமைக்கிறது.',
  },
  statusPendingAssignment: {
    en: 'Pending Assignment',
    ta: 'à®’à®¤à¯à®•à¯à®•à¯€à®Ÿà¯ à®¨à®¿à®²à¯à®µà¯ˆ',
  },
  mainAdminPanelLabel: {
    en: 'Central Admin Panel',
    ta: 'à®®à¯à®•à¯à®•à®¿à®¯ à®¨à®¿à®°à¯à®µà®¾à®•à®¿ à®ªà¯‡à®©à®²à¯',
  },
  adminQueueSubtitle: {
    en: 'Review new RTIs and route them to the correct department before processing starts',
    ta: 'à®ªà¯à®¤à®¿à®¯ RTI à®•à®³à¯ˆ à®ªà®°à®¿à®šà¯€à®²à®¿à®¤à¯à®¤à¯ à®šà®°à®¿à®¯à®¾à®© à®¤à¯à®±à¯ˆà®•à¯à®•à¯ à®…à®©à¯à®ªà¯à®ªà®µà¯à®®à¯',
  },
  adminAssignAction: {
    en: 'Assign',
    ta: 'à®’à®¤à¯à®•à¯à®•à¯',
  },
  adminAssignmentUpdated: {
    en: 'Application assigned successfully.',
    ta: 'à®µà®¿à®£à¯à®£à®ªà¯à®ªà®®à¯ à®µà¯†à®±à¯à®±à®¿à®•à®°à®®à®¾à®• à®’à®¤à¯à®•à¯à®•à®ªà¯à®ªà®Ÿà¯à®Ÿà®¤à¯.',
  },
  adminAssignmentFailed: {
    en: 'Failed to assign application. Please try again.',
    ta: 'à®µà®¿à®£à¯à®£à®ªà¯à®ªà®¤à¯à®¤à¯ˆ à®’à®¤à¯à®•à¯à®• à®®à¯à®Ÿà®¿à®¯à®µà®¿à®²à¯à®²à¯ˆ. à®®à¯€à®£à¯à®Ÿà¯à®®à¯ à®®à¯à®¯à®±à¯à®šà®¿à®•à¯à®•à®µà¯à®®à¯.',
  },
  adminDepartmentLabel: {
    en: 'Department',
    ta: 'à®¤à¯à®±à¯ˆ',
  },
  adminChooseDepartment: {
    en: 'Select Department',
    ta: 'à®¤à¯à®±à¯ˆà®¯à¯ˆ à®¤à¯‡à®°à¯à®¨à¯à®¤à¯†à®Ÿà¯à®•à¯à®•à®µà¯à®®à¯',
  },
  adminTransferReason: {
    en: 'Assignment Note',
    ta: 'à®’à®¤à¯à®•à¯à®•à¯€à®Ÿà¯ à®•à¯à®±à®¿à®ªà¯à®ªà¯',
  },
  adminTransferReasonPlaceholder: {
    en: 'Why is this department the correct owner?',
    ta: 'à®‡à®¨à¯à®¤ à®µà®¿à®£à¯à®£à®ªà¯à®ªà®¤à¯à®¤à®¿à®±à¯à®•à¯ à®à®©à¯ à®‡à®¨à¯à®¤ à®¤à¯à®±à¯ˆà®¯à¯‡ à®šà®°à®¿à®¯à®¾à®©à®¤à¯?',
  },
  adminAssignedBy: {
    en: 'Assigned By',
    ta: 'à®’à®¤à¯à®•à¯à®•à®¿à®¯à®µà®°à¯',
  },
  adminAssignedAt: {
    en: 'Assigned At',
    ta: 'à®’à®¤à¯à®•à¯à®•à®ªà¯à®ªà®Ÿà¯à®Ÿ à®¨à¯‡à®°à®®à¯',
  },
  adminCurrentDepartment: {
    en: 'Current Department',
    ta: 'à®¤à®±à¯à®ªà¯‹à®¤à¯à®¯ à®¤à¯à®±à¯ˆ',
  },
  adminRequestedDepartment: {
    en: 'Requested Department',
    ta: 'பரிந்துரைக்கப்பட்ட துறை',
  },
  pioLogin: {
    en: 'PIO Login',
    ta: 'PIO à®‰à®³à¯à®¨à¯à®´à¯ˆà®µà¯',
  },
  pioLoginSubtitle: {
    en: 'Sign in as a Public Information Officer to handle cases assigned specifically to you',
    ta: 'à®‰à®™à¯à®•à®³à¯à®•à¯à®•à¯ à®•à¯à®±à®¿à®ªà¯à®ªà®¾à®• à®’à®¤à¯à®•à¯à®•à®ªà¯à®ªà®Ÿà¯à®Ÿ à®µà®´à®•à¯à®•à¯à®•à®³à¯ˆ à®•à¯ˆà®¯à®¾à®³ à®ªà¯Šà®¤à¯ à®¤à®•à®µà®²à¯ à®…à®²à¯à®µà®²à®°à®¾à®• à®‰à®³à¯à®¨à¯à®´à¯ˆà®¯à®µà¯à®®à¯',
  },
  pioLoginHelper: {
    en: 'Use your PIO office credentials here to view and update cases assigned directly to you.',
    ta: 'à®‰à®™à¯à®•à®³à¯ PIO à®…à®²à¯à®µà®²à®• à®‰à®³à¯à®¨à¯à®´à¯ˆà®µà¯ à®¤à®•à®µà®²à¯à®•à®³à¯ˆ à®‡à®™à¯à®•à¯‡ à®ªà®¯à®©à¯à®ªà®Ÿà¯à®¤à¯à®¤à®¿, à®¨à¯‡à®°à®Ÿà®¿à®¯à®¾à®• à®‰à®™à¯à®•à®³à¯à®•à¯à®•à¯ à®’à®¤à¯à®•à¯à®•à®ªà¯à®ªà®Ÿà¯à®Ÿ à®µà®´à®•à¯à®•à¯à®•à®³à¯ˆ à®•à®¾à®£à®µà¯à®®à¯ à®ªà¯à®¤à¯à®ªà¯à®ªà®¿à®•à¯à®•à®µà¯à®®à¯.',
  },
  pioLoginCardDesc: {
    en: 'Public Information Officers view and respond only to RTIs specifically assigned to them.',
    ta: 'à®ªà¯Šà®¤à¯ à®¤à®•à®µà®²à¯ à®…à®²à¯à®µà®²à®°à¯à®•à®³à¯ à®¤à®™à¯à®•à®³à¯à®•à¯à®•à¯ à®•à¯à®±à®¿à®ªà¯à®ªà®¾à®• à®’à®¤à¯à®•à¯à®•à®ªà¯à®ªà®Ÿà¯à®Ÿ RTI à®•à®³à¯ˆ à®®à®Ÿà¯à®Ÿà¯à®®à¯‡ à®•à®¾à®£à¯à®Ÿà¯ à®ªà®¤à®¿à®²à®³à®¿à®ªà¯à®ªà®¾à®°à¯à®•à®³à¯.',
  },
};

/**
 * Helper to get a translation string.
 * @param {string} lang - 'en' or 'ta'
 * @param {string} key  - key from translations object
 * @returns {string}
 */
export function t(lang, key) {
  if (!translations[key]) {
    console.warn(`[i18n] Missing translation key: "${key}"`);
    return key;
  }
  const value = translations[key][lang] ?? translations[key]['en'];
  if (typeof value !== 'string' || !/[ÂÃâàð]/.test(value)) {
    return value;
  }

  try {
    const bytes = Uint8Array.from(value, (char) => char.charCodeAt(0) & 0xff);
    return new TextDecoder('utf-8').decode(bytes);
  } catch {
    return value;
  }
}

export default translations;
