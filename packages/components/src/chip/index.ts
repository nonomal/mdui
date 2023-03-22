import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { emit } from '@mdui/shared/helpers/event.js';
import '@mdui/icons/check.js';
import '@mdui/icons/clear.js';
import { ButtonBase } from '../button/button-base.js';
import '../icon.js';
import { style } from './style.js';
import type { MaterialIconsName } from '../icon.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * @event click - 点击时触发
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event change - 选中状态变更时触发
 * @event delete - 点击删除图标时触发
 *
 * @slot - 文本
 * @slot icon - 左侧图标
 * @slot selected-icon - 选中状态的左侧图标
 * @slot end-icon - 右侧图标
 * @slot delete-icon - 删除图标
 *
 * @csspart button - 内部的 button 或 a 元素
 * @csspart label - 文本
 * @csspart icon - 左侧图标
 * @csspart selected-icon - 选中状态的左侧图标
 * @csspart end-icon - 右侧图标
 * @csspart delete-icon-wrapper - 删除图标的容器
 * @csspart delete-icon - 删除图标
 * @csspart loading - 加载中动画
 *
 * @cssprop --shape-corner 圆角大小。可以指定一个具体的像素值；但更推荐[引用系统变量]()
 */
@customElement('mdui-chip')
export class Chip extends ButtonBase {
  public static override styles: CSSResultGroup = [ButtonBase.styles, style];

  /**
   * 纸片形状。可选值为：
   * * `assist`
   * * `filter`
   * * `input`
   * * `suggestion`
   */
  @property({ reflect: true })
  public variant:
    | 'assist' /*预览图*/
    | 'filter' /*预览图*/
    | 'input' /*预览图*/
    | 'suggestion' = 'assist';

  /**
   * 是否包含阴影
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean =>
      value !== null && value !== 'false',
  })
  public elevated = false;

  /**
   * 是否可选中
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean =>
      value !== null && value !== 'false',
  })
  public selectable = false;

  /**
   * 是否为选中状态
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean =>
      value !== null && value !== 'false',
  })
  public selected = false;

  /**
   * 是否可删除。为 `true` 时，在右侧会显示删除图标
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean =>
      value !== null && value !== 'false',
  })
  public deletable = false;

  /**
   * 左侧的 Material Icons 图标名
   */
  @property({ reflect: true })
  public icon!: MaterialIconsName;

  /**
   * 选中状态，左侧的 Material Icons 图标名
   */
  @property({ reflect: true, attribute: 'selected-icon' })
  public selectedIcon!: MaterialIconsName;

  /**
   * 右侧的 Material Icons 图标名
   */
  @property({ reflect: true, attribute: 'end-icon' })
  public endIcon!: MaterialIconsName;

  /**
   * 右侧的 Material Icons 图标名
   */
  @property({ reflect: true, attribute: 'delete-icon' })
  public deleteIcon!: MaterialIconsName;

  private readonly rippleRef: Ref<Ripple> = createRef();
  private readonly hasSlotController = new HasSlotController(this, 'end-icon');

  public constructor() {
    super();

    this.onClick = this.onClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  protected override get rippleElement() {
    return this.rippleRef.value!;
  }

  @watch('selected', true)
  private onSelectedChange() {
    emit(this, 'change');
  }

  protected override firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);

    this.addEventListener('click', this.onClick);
    this.addEventListener('keydown', this.onKeyDown);
  }

  protected override render(): TemplateResult {
    return html`<mdui-ripple ${ref(this.rippleRef)}></mdui-ripple>
      ${this.isButton()
        ? this.renderButton({
            className: 'button',
            part: 'button',
            content: this.renderInner(),
          })
        : this.disabled || this.loading
        ? html`<span part="button" class="button">
            ${this.renderInner()}
          </span>`
        : this.renderAnchor({
            className: 'button',
            part: 'button',
            content: this.renderInner(),
          })}
      ${this.renderLoading()}`;
  }

  private onClick() {
    if (this.disabled || this.loading) {
      return;
    }

    // 点击时，切换选中状态
    if (this.selectable) {
      this.selected = !this.selected;
    }
  }

  private onKeyDown(event: KeyboardEvent) {
    if (this.disabled || this.loading) {
      return;
    }

    // 按下空格键时，切换选中状态
    if (this.selectable && event.key === ' ') {
      event.preventDefault();
      this.selected = !this.selected;
    }

    // 按下 Delete 或 BackSpace 键时，触发 delete 事件
    if (this.deletable && ['Delete', 'Backspace'].includes(event.key)) {
      emit(this, 'delete');
    }
  }

  /**
   * 点击删除按钮
   */
  private onDelete(event: MouseEvent) {
    event.stopPropagation();
    emit(this, 'delete');
  }

  private renderStart(): TemplateResult {
    return this.selected
      ? html`<slot name="selected-icon">${this.renderSelectedIcon()}</slot>`
      : html`<slot name="icon">${this.renderIcon()}</slot>`;
  }

  private renderIcon(): TemplateResult {
    return when(
      this.icon,
      () => html`<mdui-icon
        part="icon"
        class="icon"
        name=${this.icon}
      ></mdui-icon>`,
    );
  }

  private renderSelectedIcon(): TemplateResult {
    if (this.selectedIcon) {
      return html`<mdui-icon
        part="selected-icon"
        class="icon"
        name="${this.selectedIcon}"
      ></mdui-icon>`;
    }

    if (this.variant === 'assist' || this.variant === 'filter') {
      return html`<mdui-icon-check
        part="selected-icon"
        class="icon"
      ></mdui-icon-check>`;
    }

    return this.renderIcon();
  }

  private renderLabel(): TemplateResult {
    return html`<span part="label" class="label"><slot></slot></span>`;
  }

  private renderEnd(): TemplateResult {
    return html`<slot name="end-icon">
      ${when(
        this.endIcon,
        () => html`<mdui-icon
          part="end-icon"
          class="end-icon"
          name="${this.endIcon}"
        ></mdui-icon>`,
      )}
    </slot>`;
  }

  private renderDeleteIcon(): TemplateResult {
    if (!this.deletable) {
      return html`${nothing}`;
    }

    return html`<span
      part="delete-icon-wrapper"
      class="delete-icon-wrapper ${classMap({
        'has-end-icon': this.endIcon || this.hasSlotController.test('end-icon'),
      })}"
    >
      <slot name="delete-icon" @click=${this.onDelete}>
        ${when(
          this.deleteIcon,
          () => html`<mdui-icon
            part="delete-icon"
            class="delete-icon"
            name="${this.deleteIcon}"
          ></mdui-icon>`,
          () => html`<mdui-icon-clear
            part="delete-icon"
            class="delete-icon"
          ></mdui-icon-clear>`,
        )}
      </slot>
    </span>`;
  }

  private renderInner(): TemplateResult[] {
    return [
      this.renderStart(),
      this.renderLabel(),
      this.renderEnd(),
      this.renderDeleteIcon(),
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-chip': Chip;
  }
}
