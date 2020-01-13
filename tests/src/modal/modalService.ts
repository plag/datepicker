import scrollbarWidth from 'dom-helpers/scrollbarSize';

class ModalService {
  private modalsCount = 0;

  public addModal(): void {
    this.modalsCount += 1;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = scrollbarWidth() + 'px';
  }

  public closeModal(): void {
    this.modalsCount -= 1;
    if (this.modalsCount === 0) {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0px';
    }
  }
}

export default new ModalService();
