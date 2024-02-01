// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          welcome: 'Welcome to my chat app',
          email: 'Email',
          phone: 'Phone',
          address: 'Address',
          country: 'Country',
          project: 'Project',
          deadline: 'Deadline',
          invoice: 'Invoice',
          budget: 'Budget',
          viewProfile: 'View Profile',
          status: 'Status',
          // Add more English translations here
        },
      },
      ar: {
        translation: {
          welcome: 'مرحبًا بك في تطبيق الدردشة الخاص بي',
          email: 'البريد الإلكتروني',
          phone: 'الهاتف',
          address: 'العنوان',
          country: 'الدولة',
          project: 'المشروع',
          deadline: 'الموعد النهائي',
          invoice: 'الفاتورة',
          budget: 'الميزانية',
          viewProfile: 'عرض الملف الشخصي',
          status: 'الحالة',
          // Add more Arabic translations here
        },
      },
    },
    lng: 'en', // Default language
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
