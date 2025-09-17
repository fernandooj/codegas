import { LocaleConfig } from 'react-native-calendars';

// Configuración en español para el calendario
LocaleConfig.locales['es'] = {
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ener.', 'Febr.', 'Marzo.', 'Abril.', 'Mayo.', 'Jun.', 'Jul.', 'Agos', 'Sept.', 'Oct.', 'Nov.', 'Dic.'],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
    dayNamesShort: ['Dom.', 'Lun.', 'Mar.', 'Mie.', 'Jue.', 'Vie.', 'Sab.'],
    today: 'Hoy'
};

// Establecer español como idioma por defecto
LocaleConfig.defaultLocale = 'es';

// Función para configurar el calendario en español
export const setupCalendarLocale = () => {
    LocaleConfig.defaultLocale = 'es';
};

export default LocaleConfig;
