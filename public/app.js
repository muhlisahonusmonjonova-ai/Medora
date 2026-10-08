const languageSelect = document.querySelector('#language-select');
const searchInput = document.querySelector('#doctor-search');
const specialtySelect = document.querySelector('#specialty-filter');
const clearFiltersButton = document.querySelector('#clear-filters');
const doctorGrid = document.querySelector('#doctor-grid');
const emptyState = document.querySelector('#empty-state');
const doctorCount = document.querySelector('#doctor-count');
const directoryMessage = document.querySelector('#directory-message');
const bookingDialog = document.querySelector('#booking-dialog');
const bookingForm = document.querySelector('#booking-form');
const slotSelect = document.querySelector('#appointment-slot');
const bookingDoctorId = document.querySelector('#booking-doctor-id');
const selectedDoctor = document.querySelector('#selected-doctor');
const dialogMessage = document.querySelector('#dialog-message');
const bookSubmit = document.querySelector('#book-submit');
const languageStorageKey = 'medora-language';

const translations = {
  en: {
    languageLabel: 'Choose language', filterAria: 'Doctor filters', closeDialog: 'Close',
    headerNote: 'Your health, in good hands', findDoctor: 'Find a doctor',
    eyebrow: 'CARE THAT COMES TO YOU', heroTitle: 'The right care.<br><span>The right here.</span>',
    heroDescription: 'Meet trusted specialists and make time for your health — all in one simple place.',
    heroMeta: 'Thoughtful care, just a few clicks away.', artTitle: 'Care made simple',
    artSubtitle: 'Appointments on your time', directoryEyebrow: 'YOUR CARE TEAM',
    directoryTitle: 'Find your specialist', directoryDescription: 'Experienced doctors, ready when you are.',
    doctorsFound: 'doctors found', filters: 'Filters', clear: 'Clear',
    searchLabel: 'Search doctors', searchPlaceholder: 'Name or specialty', specialtyLabel: 'Specialty',
    allSpecialties: 'All specialties', filterNote: 'Care you can feel good about.',
    showingDoctors: 'Our specialists', liveAvailability: 'Live availability',
    loading: 'Finding your care team...', emptyTitle: 'No doctors found',
    emptyDescription: 'Try a different name or specialty.', footerText: 'Care that puts people first.',
    dialogKicker: 'YOUR APPOINTMENT', dialogTitle: 'Book a visit',
    dialogDescription: 'Choose a time and leave your contact details. We’ll take it from there.',
    slotLabel: 'Available date & time', nameLabel: 'Your full name', namePlaceholder: 'e.g. Alex Morgan',
    phoneLabel: 'Phone number', confirmBooking: 'Confirm appointment',
    privacyNote: 'Your contact details are only used for this appointment.',
    experience: 'years experience', perVisit: 'per visit', book: 'Book',
    available: 'Available', chooseSlot: 'Select a date and time', noSlots: 'No times available',
    noDoctors: 'No doctors are available yet.', invalidBooking: 'Check your details and select an available time.',
    loadingSlots: 'Loading available times...', slotsError: 'Could not load appointment times.',
    appointmentSuccess: 'Your appointment is confirmed.', slotConflict: 'That time was just booked. Please choose another.',
    bookingError: 'Could not book the appointment. Please try again.', doctorsError: 'Could not load doctors. Please try again.',
    connectionError: 'Could not connect to the booking service. Please try again.',
    selectDoctor: 'Please choose a doctor first.', unknownSpecialty: 'Medical care',
    specialties: { Cardiology: 'Cardiology', Dermatology: 'Dermatology', Neurology: 'Neurology', Pediatrics: 'Pediatrics', 'Family medicine': 'Family medicine', Ophthalmology: 'Ophthalmology' }
  },
  ru: {
    languageLabel: 'Выбрать язык', filterAria: 'Фильтры врачей', closeDialog: 'Закрыть',
    headerNote: 'Ваше здоровье в надежных руках', findDoctor: 'Найти врача',
    eyebrow: 'ЗАБОТА РЯДОМ С ВАМИ', heroTitle: 'Нужная помощь.<br><span>Именно здесь.</span>',
    heroDescription: 'Найдите проверенного специалиста и уделите время своему здоровью — всё в одном месте.',
    heroMeta: 'Забота о вас — всего в нескольких кликах.', artTitle: 'Забота — это просто',
    artSubtitle: 'Запись в удобное время', directoryEyebrow: 'КОМАНДА ВРАЧЕЙ',
    directoryTitle: 'Найдите своего специалиста', directoryDescription: 'Опытные врачи готовы вам помочь.',
    doctorsFound: 'врачей найдено', filters: 'Фильтры', clear: 'Сбросить',
    searchLabel: 'Поиск врачей', searchPlaceholder: 'Имя или специальность', specialtyLabel: 'Специальность',
    allSpecialties: 'Все специальности', filterNote: 'Забота, которой можно доверять.',
    showingDoctors: 'Наши специалисты', liveAvailability: 'Актуальное расписание',
    loading: 'Подбираем врачей...', emptyTitle: 'Врачи не найдены',
    emptyDescription: 'Попробуйте другое имя или специальность.', footerText: 'Забота о людях — прежде всего.',
    dialogKicker: 'ВАША ЗАПИСЬ', dialogTitle: 'Записаться на приём',
    dialogDescription: 'Выберите время и оставьте контактные данные. Об остальном позаботимся мы.',
    slotLabel: 'Дата и время', nameLabel: 'Ваше имя и фамилия', namePlaceholder: 'Например, Анна Иванова',
    phoneLabel: 'Номер телефона', confirmBooking: 'Подтвердить запись',
    privacyNote: 'Контактные данные нужны только для этой записи.',
    experience: 'лет стажа', perVisit: 'за приём', book: 'Записаться',
    available: 'Есть время', chooseSlot: 'Выберите дату и время', noSlots: 'Нет свободного времени',
    noDoctors: 'Пока нет доступных врачей.', invalidBooking: 'Проверьте данные и выберите свободное время.',
    loadingSlots: 'Загружаем свободное время...', slotsError: 'Не удалось загрузить время приёма.',
    appointmentSuccess: 'Вы записаны на приём.', slotConflict: 'Это время только что заняли. Выберите другое.',
    bookingError: 'Не удалось оформить запись. Попробуйте ещё раз.', doctorsError: 'Не удалось загрузить врачей.',
    connectionError: 'Нет связи со службой записи. Попробуйте ещё раз.',
    selectDoctor: 'Сначала выберите врача.', unknownSpecialty: 'Медицинская помощь',
    specialties: { Cardiology: 'Кардиология', Dermatology: 'Дерматология', Neurology: 'Неврология', Pediatrics: 'Педиатрия', 'Family medicine': 'Семейная медицина', Ophthalmology: 'Офтальмология' }
  },
  uz: {
    languageLabel: 'Tilni tanlang', filterAria: 'Shifokorlarni filtrlash', closeDialog: 'Yopish',
    headerNote: 'Sog‘lig‘ingiz ishonchli qo‘llarda', findDoctor: 'Shifokor topish',
    eyebrow: 'SIZGA YAQIN TIBBIY YORDAM', heroTitle: 'Kerakli yordam.<br><span>Shu yerda.</span>',
    heroDescription: 'Ishonchli mutaxassisni toping va sog‘lig‘ingizga vaqt ajrating — barchasi bir joyda.',
    heroMeta: 'G‘amxo‘rlik bir necha bosish narida.', artTitle: 'Tibbiy yordam oson',
    artSubtitle: 'Sizga qulay vaqtda qabul', directoryEyebrow: 'SHIFOKORLAR JAMOASI',
    directoryTitle: 'Mutaxassisni toping', directoryDescription: 'Tajribali shifokorlar sizni kutmoqda.',
    doctorsFound: 'nafar shifokor topildi', filters: 'Filtrlar', clear: 'Tozalash',
    searchLabel: 'Shifokorlarni qidirish', searchPlaceholder: 'Ism yoki mutaxassislik', specialtyLabel: 'Mutaxassislik',
    allSpecialties: 'Barcha mutaxassisliklar', filterNote: 'Ishonchli tibbiy yordam.',
    showingDoctors: 'Mutaxassislarimiz', liveAvailability: 'Joriy bo‘sh vaqtlar',
    loading: 'Shifokorlar topilmoqda...', emptyTitle: 'Shifokor topilmadi',
    emptyDescription: 'Boshqa ism yoki mutaxassislikni qidirib ko‘ring.', footerText: 'Avvalo inson salomatligi.',
    dialogKicker: 'QABULGA YOZILISH', dialogTitle: 'Qabulga yoziling',
    dialogDescription: 'Vaqtni tanlang va aloqa ma’lumotlaringizni qoldiring. Qolganini biz hal qilamiz.',
    slotLabel: 'Sana va vaqt', nameLabel: 'Ism-familiyangiz', namePlaceholder: 'Masalan, Ali Valiyev',
    phoneLabel: 'Telefon raqami', confirmBooking: 'Qabulni tasdiqlash',
    privacyNote: 'Aloqa ma’lumotlari faqat ushbu qabul uchun ishlatiladi.',
    experience: 'yil tajriba', perVisit: 'har bir qabul', book: 'Yozilish',
    available: 'Bo‘sh vaqt bor', chooseSlot: 'Sana va vaqtni tanlang', noSlots: 'Bo‘sh vaqt yo‘q',
    noDoctors: 'Hozircha shifokorlar mavjud emas.', invalidBooking: 'Ma’lumotlarni tekshiring va bo‘sh vaqtni tanlang.',
    loadingSlots: 'Bo‘sh vaqtlar yuklanmoqda...', slotsError: 'Qabul vaqtlarini yuklab bo‘lmadi.',
    appointmentSuccess: 'Qabulga muvaffaqiyatli yozildingiz.', slotConflict: 'Bu vaqt hozirgina band qilindi. Boshqasini tanlang.',
    bookingError: 'Qabulga yozib bo‘lmadi. Qayta urinib ko‘ring.', doctorsError: 'Shifokorlarni yuklab bo‘lmadi.',
    connectionError: 'Qabul xizmati bilan bog‘lanib bo‘lmadi. Qayta urinib ko‘ring.',
    selectDoctor: 'Avval shifokorni tanlang.', unknownSpecialty: 'Tibbiy yordam',
    specialties: { Cardiology: 'Kardiologiya', Dermatology: 'Dermatologiya', Neurology: 'Nevrologiya', Pediatrics: 'Pediatriya', 'Family medicine': 'Oilaviy tibbiyot', Ophthalmology: 'Oftalmologiya' }
  }
};

const localeByLanguage = { en: 'en-US', ru: 'ru-RU', uz: 'uz-UZ' };
let currentLanguage = localStorage.getItem(languageStorageKey);
if (!translations[currentLanguage]) currentLanguage = 'en';
let doctors = [];
let doctorsLoaded = false;
let doctorsLoadFailed = false;

function text(key) {
  return translations[currentLanguage][key] || translations.en[key] || key;
}

function translatePage() {
  document.documentElement.lang = currentLanguage;
  document.title = currentLanguage === 'ru' ? 'Medora — Найти врача' : currentLanguage === 'uz' ? 'Medora — Shifokor topish' : 'Medora — Find your doctor';
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const value = text(element.dataset.i18n);
    if (element.dataset.i18n === 'heroTitle') element.innerHTML = value;
    else element.textContent = value;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    element.placeholder = text(element.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
    element.setAttribute('aria-label', text(element.dataset.i18nAria));
  });
  renderSpecialties();
  renderDoctors();
  if (bookingDialog.open && bookingDoctorId.value) {
    const doctor = doctors.find((item) => String(item.id) === bookingDoctorId.value);
    if (doctor) {
      renderBookingDoctor(doctor);
      renderBookingSlots(doctor);
    }
  }
}

function localizeSpecialty(specialty) {
  return translations[currentLanguage].specialties[specialty] || specialty || text('unknownSpecialty');
}

function formatMoney(price) {
  return new Intl.NumberFormat(localeByLanguage[currentLanguage], {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(Number(price));
}

function formatSlot(slot) {
  const date = new Date(`${slot.date}T00:00:00`);
  const dateText = new Intl.DateTimeFormat(localeByLanguage[currentLanguage], {
    month: 'short',
    day: 'numeric'
  }).format(date);
  const timeText = new Intl.DateTimeFormat(localeByLanguage[currentLanguage], {
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(`2000-01-01T${slot.time}:00`));
  return `${dateText} · ${timeText}`;
}

function initials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase();
}

function safePhotoUrl(value) {
  if (typeof value !== 'string' || !value) return '';
  try {
    const url = new URL(value, window.location.origin);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

function renderSpecialties() {
  const selected = specialtySelect.value;
  const specialties = [...new Set(doctors.map((doctor) => doctor.specialty).filter(Boolean))].sort();
  specialtySelect.replaceChildren(new Option(text('allSpecialties'), 'all'));
  specialties.forEach((specialty) => {
    specialtySelect.add(new Option(localizeSpecialty(specialty), specialty));
  });
  if (specialties.includes(selected)) specialtySelect.value = selected;
}

function filteredDoctors() {
  const query = searchInput.value.trim().toLocaleLowerCase(localeByLanguage[currentLanguage]);
  const chosenSpecialty = specialtySelect.value;
  return doctors.filter((doctor) => {
    const name = (doctor.full_name || '').toLocaleLowerCase(localeByLanguage[currentLanguage]);
    const specialty = (doctor.specialty || '').toLocaleLowerCase(localeByLanguage[currentLanguage]);
    const translatedSpecialty = localizeSpecialty(doctor.specialty).toLocaleLowerCase(localeByLanguage[currentLanguage]);
    const matchesQuery = !query || name.includes(query) || specialty.includes(query) || translatedSpecialty.includes(query);
    return matchesQuery && (chosenSpecialty === 'all' || doctor.specialty === chosenSpecialty);
  });
}

function createDoctorCard(doctor, index) {
  const card = document.createElement('article');
  card.className = 'doctor-card';
  card.style.animationDelay = `${Math.min(index * 45, 270)}ms`;

  const photo = document.createElement('div');
  photo.className = 'doctor-photo';
  const fallback = document.createElement('span');
  fallback.className = 'photo-initials';
  fallback.textContent = initials(doctor.full_name);
  photo.append(fallback);

  const photoUrl = safePhotoUrl(doctor.photo_url);
  if (photoUrl) {
    const image = document.createElement('img');
    image.src = photoUrl;
    image.alt = doctor.full_name;
    image.loading = 'lazy';
    image.addEventListener('error', () => image.remove(), { once: true });
    photo.prepend(image);
  }

  const availability = document.createElement('span');
  availability.className = 'availability-pill';
  const indicator = document.createElement('span');
  const hasSlots = doctor.available_slots.length > 0;
  if (!hasSlots) availability.classList.add('unavailable');
  availability.append(indicator, document.createTextNode(text(hasSlots ? 'available' : 'noSlots')));
  photo.append(availability);

  const info = document.createElement('div');
  info.className = 'doctor-info';
  const specialty = document.createElement('span');
  specialty.className = 'doctor-specialty';
  specialty.textContent = localizeSpecialty(doctor.specialty);
  const name = document.createElement('h3');
  name.className = 'doctor-name';
  name.textContent = doctor.full_name;
  const experience = document.createElement('p');
  experience.className = 'doctor-experience';
  experience.textContent = `${doctor.experience_years} ${text('experience')}`;
  const bottom = document.createElement('div');
  bottom.className = 'doctor-bottom';
  const price = document.createElement('strong');
  price.className = 'doctor-price';
  price.textContent = formatMoney(doctor.price_per_visit);
  const priceLabel = document.createElement('small');
  priceLabel.textContent = text('perVisit');
  price.append(priceLabel);
  const book = document.createElement('button');
  book.className = 'book-button';
  book.type = 'button';
  book.textContent = text('book');
  book.disabled = !doctor.available_slots.length;
  if (book.disabled) book.title = text('noSlots');
  book.addEventListener('click', () => openBooking(doctor));
  bottom.append(price, book);
  info.append(specialty, name, experience, bottom);
  card.append(photo, info);
  return card;
}

function renderDoctors() {
  const filtered = filteredDoctors();
  doctorCount.textContent = doctorsLoaded ? String(filtered.length) : '—';
  if (!doctorsLoaded) {
    const loading = document.createElement('div');
    loading.className = 'loading-state';
    loading.textContent = text('loading');
    doctorGrid.replaceChildren(loading);
    emptyState.hidden = true;
    return;
  }
  doctorGrid.replaceChildren(...filtered.map(createDoctorCard));
  emptyState.hidden = filtered.length > 0;
  if (doctors.length === 0) {
    emptyState.querySelector('h3').textContent = text(doctorsLoadFailed ? 'doctorsError' : 'noDoctors');
    emptyState.querySelector('p').textContent = '';
  } else {
    emptyState.querySelector('h3').textContent = text('emptyTitle');
    emptyState.querySelector('p').textContent = text('emptyDescription');
  }
}

function renderBookingDoctor(doctor) {
  selectedDoctor.replaceChildren();
  const photoUrl = safePhotoUrl(doctor.photo_url);
  let image;
  if (photoUrl) {
    image = document.createElement('img');
    image.src = photoUrl;
    image.alt = '';
    image.addEventListener('error', () => {
      const fallback = document.createElement('span');
      fallback.className = 'selected-avatar';
      fallback.textContent = initials(doctor.full_name);
      image.replaceWith(fallback);
    }, { once: true });
  } else {
    image = document.createElement('span');
    image.className = 'selected-avatar';
    image.textContent = initials(doctor.full_name);
  }
  const details = document.createElement('span');
  const name = document.createElement('strong');
  name.textContent = doctor.full_name;
  const specialty = document.createElement('small');
  specialty.textContent = `${localizeSpecialty(doctor.specialty)} · ${formatMoney(doctor.price_per_visit)} ${text('perVisit')}`;
  details.append(name, specialty);
  selectedDoctor.append(image, details);
}

function renderBookingSlots(doctor) {
  slotSelect.replaceChildren();
  if (doctor.available_slots.length) {
    slotSelect.add(new Option(text('chooseSlot'), ''));
    doctor.available_slots.forEach((slot) => slotSelect.add(new Option(formatSlot(slot), slot.id)));
    slotSelect.disabled = false;
  } else {
    slotSelect.add(new Option(text('noSlots'), ''));
    slotSelect.disabled = true;
  }
}

function openBooking(doctor) {
  bookingForm.reset();
  bookingDoctorId.value = String(doctor.id);
  dialogMessage.textContent = '';
  dialogMessage.className = 'dialog-message';
  bookSubmit.disabled = false;
  renderBookingDoctor(doctor);
  renderBookingSlots(doctor);
  bookingDialog.showModal();
  document.querySelector('#full-name').focus();
}

async function loadDoctors() {
  directoryMessage.textContent = '';
  try {
    const response = await fetch('/api/doctors');
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || text('doctorsError'));
    doctors = result.doctors;
    doctorsLoaded = true;
    doctorsLoadFailed = false;
    renderSpecialties();
    renderDoctors();
  } catch (error) {
    doctors = [];
    doctorsLoaded = true;
    doctorsLoadFailed = true;
    doctorCount.textContent = '0';
    doctorGrid.replaceChildren();
    emptyState.hidden = false;
    emptyState.querySelector('h3').textContent = text('doctorsError');
    emptyState.querySelector('p').textContent = '';
    directoryMessage.textContent = error instanceof TypeError ? text('connectionError') : text('doctorsError');
  }
}

languageSelect.value = currentLanguage;
languageSelect.addEventListener('change', () => {
  currentLanguage = languageSelect.value;
  localStorage.setItem(languageStorageKey, currentLanguage);
  translatePage();
});
searchInput.addEventListener('input', renderDoctors);
specialtySelect.addEventListener('change', renderDoctors);
clearFiltersButton.addEventListener('click', () => {
  searchInput.value = '';
  specialtySelect.value = 'all';
  renderDoctors();
  searchInput.focus();
});
document.querySelector('#dialog-close').addEventListener('click', () => bookingDialog.close());
bookingDialog.addEventListener('click', (event) => {
  if (event.target === bookingDialog) bookingDialog.close();
});
bookingForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  dialogMessage.textContent = '';
  dialogMessage.className = 'dialog-message';
  bookSubmit.disabled = true;
  const formData = new FormData(bookingForm);
  const payload = {
    schedule_id: formData.get('schedule_id'),
    full_name: formData.get('full_name'),
    phone: formData.get('phone')
  };
  try {
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) {
      if (response.status === 409) throw new Error(text('slotConflict'));
      throw new Error(response.status >= 500 ? text('bookingError') : response.status === 400 ? text('invalidBooking') : (result.error || text('bookingError')));
    }
    dialogMessage.textContent = text('appointmentSuccess');
    bookSubmit.disabled = true;
    await loadDoctors();
    const selected = doctors.find((doctor) => String(doctor.id) === bookingDoctorId.value);
    if (selected) {
      renderBookingDoctor(selected);
      renderBookingSlots(selected);
    }
  } catch (error) {
    dialogMessage.textContent = error instanceof TypeError ? text('connectionError') : error.message;
    dialogMessage.className = 'dialog-message error';
    bookSubmit.disabled = false;
    await loadDoctors();
  }
});

translatePage();
loadDoctors();
