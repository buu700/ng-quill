import {Component, ElementRef, OnInit, OnDestroy, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import * as Quill from 'quill';


@Component({
	selector: 'wa-quill',
	template: '',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: QuillComponent,
			multi: true,
		},
	],
})
export class QuillComponent implements OnInit, OnDestroy, ControlValueAccessor
{


	@Input()
	public theme: string = 'snow';

	@Input()
	public options: any = null;

	protected editor: Quill.Quill;

	private defaultContents: any|undefined;

	private isDisabled: boolean = false;


	constructor(
		private $el: ElementRef,
	) {}


	public ngOnInit(): void
	{
		const options = this.options || {};

		if (typeof options.theme === 'undefined') {
			options.theme = this.theme;
		}

		this.editor = new Quill(this.$el.nativeElement, options);

		this.setDisabledState(this.isDisabled);

		if (typeof this.defaultContents !== 'undefined') {
			this.editor.setContents(this.defaultContents);
		}

		this.editor.on('text-change', () => {
			this.onChange(this.getValue());
		});

		this.$el.nativeElement.querySelector('.ql-editor').addEventListener('blur', () => {
			this.onTouched();
		});
	}


	public ngOnDestroy(): void
	{
	}


	public writeValue(contents: any): void
	{
		if (this.editor) {
			this.editor.setContents(contents);
		} else {
			this.defaultContents = contents;
		}
	}


	public registerOnChange(fn: any): void
	{
		this.onChange = fn;
	}


	public registerOnTouched(fn: any): void
	{
		this.onTouched = fn;
	}

	public setDisabledState(isDisabled: boolean) : void
	{
		this.isDisabled = isDisabled;

		if (!this.editor) {
			return;
		}

		if (isDisabled) {
			this.editor.disable();
		} else {
			this.editor.enable();
		}
	}


	protected getValue(): any|undefined
	{
		if (!this.editor) {
			return undefined;
		}

		const contents: any = this.editor.getContents();

		if (this.isEmpty(contents)) {
			return undefined;
		}

		return contents;
	}


	protected isEmpty(contents: any): boolean
	{
		if (contents.ops.length > 1) {
			return false;
		}

		const opsTypes: Array<string> = Object.keys(contents.ops[0]);

		if (opsTypes.length > 1) {
			return false;
		}

		if (opsTypes[0] !== 'insert') {
			return false;
		}

		if (contents.ops[0].insert !== '\n') {
			return false;
		}

		return true;
	}


	protected onTouched = () => {};


	private onChange = (_: any) => {};

}
