import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import '../icon.js';
import { ButtonBase } from './button-base.js';
import { style } from './style.js';
import type { Ripple } from '../ripple/index.js';
import type { TemplateResult, CSSResultGroup } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * @event click - 点击时触发
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 *
 * @slot - 按钮的文本
 * @slot start - 按钮左侧元素
 * @slot end - 按钮右侧元素
 *
 * @csspart button - 内部的 button 或 a 元素
 * @csspart label - 文本
 * @csspart start - 左侧的元素
 * @csspart end - 右侧的元素
 * @csspart loading - 加载中动画
 *
 * @cssprop --shape-corner 圆角大小。可以指定一个具体的像素值；但更推荐[引用系统变量]()
 */
@customElement('mdui-button')
export class Button extends ButtonBase {
  public static override styles: CSSResultGroup = [ButtonBase.styles, style];

  /**
   * 按钮形状。可选值为：
   * * `elevated`
   * * `filled`
   * * `tonal`
   * * `outlined`
   * * `text`
   */
  @property({ reflect: true })
  public variant:
    | 'elevated' /*预览图*/
    | 'filled' /*预览图*/
    | 'tonal' /*预览图*/
    | 'outlined' /*预览图*/
    | 'text' /*预览图*/ = 'filled';

  /**
   * 是否填满父元素宽度
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public fullwidth = false;

  /**
   * 左侧的 Material Icons 图标名
   */
  @property({ reflect: true })
  public icon?: string;

  /**
   * 右侧的 Material Icons 图标名
   */
  @property({ reflect: true, attribute: 'end-icon' })
  public endIcon?: string;

  private readonly rippleRef: Ref<Ripple> = createRef();

  protected override get rippleElement() {
    return this.rippleRef.value!;
  }

  protected override render(): TemplateResult {
    return html`<mdui-ripple
        ${ref(this.rippleRef)}
        .noRipple=${this.noRipple}
      ></mdui-ripple>
      ${this.isButton()
        ? this.renderButton({
            className: 'button',
            part: 'button',
            content: this.renderInner(),
          })
        : this.disabled || this.loading
        ? html`<span part="button" class="button _a">
            ${this.renderInner()}
          </span>`
        : this.renderAnchor({
            className: 'button',
            part: 'button',
            content: this.renderInner(),
          })}`;
  }

  private renderStart(): TemplateResult {
    if (this.loading) {
      return this.renderLoading();
    }

    return html`<slot name="start">
      ${this.icon
        ? html`<mdui-icon
            part="start"
            class="icon"
            name=${this.icon}
          ></mdui-icon>`
        : nothingTemplate}
    </slot>`;
  }

  private renderLabel(): TemplateResult {
    return html`<span part="label" class="label"><slot></slot></span>`;
  }

  private renderEnd(): TemplateResult {
    return html`<slot name="end">
      ${this.endIcon
        ? html`<mdui-icon
            part="end"
            class="icon"
            name=${this.endIcon}
          ></mdui-icon>`
        : nothingTemplate}
    </slot>`;
  }

  private renderInner(): TemplateResult[] {
    return [this.renderStart(), this.renderLabel(), this.renderEnd()];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-button': Button;
  }
}