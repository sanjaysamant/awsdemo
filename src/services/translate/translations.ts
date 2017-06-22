import {OpaqueToken} from '@angular/core';

export const TRANSLATIONS = new OpaqueToken('translations');
// import translations
import { LANG_EN_NAME, LANG_EN_TRANS } from './lang-en';
import { LANG_JA_NAME, LANG_JA_TRANS } from './lang-ja';

const dictionary = {
    [LANG_EN_NAME]: LANG_EN_TRANS,
    [LANG_JA_NAME]: LANG_JA_TRANS,
};

// providers
export const TRANSLATION_PROVIDERS = [

    {provide: TRANSLATIONS, useValue: dictionary},
];