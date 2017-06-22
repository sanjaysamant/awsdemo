import { AkNgAdminPage } from './app.po';

describe('ak-ng-admin App', () => {
  let page: AkNgAdminPage;

  beforeEach(() => {
    page = new AkNgAdminPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
