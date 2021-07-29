/* eslint-disable no-undef */
declare module 'jspanel4/es6module/jspanel' {
  type AutocloseObject = {
    /**
     * Integer is interpreted as time in milliseconds until the panel closes.
     *
     * String can be any value that can be assigned to the CSS property animation-duration
     */
    time?: string | number
    background?: string
    /**
     * By default the progressbar is shown. false turns it off
     * If progressbar is set to false any setting of background has no effect
     */
    progressbar?: boolean
    /**
     * Defaults to the primary color of the theme success
     *
     * Allows to set a custom background for the progressbar. Supported values include:
     * - any valid css color value or gradient
     * - any color name (without modifier) that can be applied to option theme
     * - any built-in theme name (without modifier)
     * Any background setting has no effect when progressbar is set to false
     */
    background?: string
  }

  type Size = {
    width?: string | number | (() => {})
    height?: string | number | (() => {})
  }
  type PanelOptions = {
    position?: string
    contentSize?: string
    contentAjax?: any
    addCloseControl?: number
    animateIn?: string
    animateOut?: string

    /**
     * Object - see description in Object properties
     *
     * Integer - sets a time in milliseconds until panel closes and uses
     * defaults for the other properties as described in Object properties
     *
     * Boolean true - uses the defaults described in Object properties
     */
    autoclose?: number | boolean | AutocloseObject

    /**
     * Applies a CSS border to all for sides of the panel.
     *
     */
    border?: string

    /**
     *
     * Applies a CSS border-radius to all for corners of the panel.
     *
     * >*To add a border radius to an existing panel use the panel method
     *  [setBorderRadius()](https://jspanel.de/#methods/setBorderRadius)*
     *
     */
    borderRadius?: string

    /**
     * Applies a CSS ox-shadow to the panel.
     */
    boxShadow?: number

    /**
     * A callback function to execute after the panel was inserted into the
     * document.
     */
    callback?: () => void

    /**
     * Closes a panel on pressing the `Esc` key. If more than one panel in the
     * document has this option enabled each `Esc` keypress closes the topmost
     * (highest z-index) panel.
     */
    closeOnEscape?: boolean

    /**
     * Option config is a predefined configuration object that will be merged
     * with the standard jsPanel configuration object and might be useful when
     * you have a number of panels sharing the same options.
     */
    config?: PanelOptions

    /**
     * Sets the parent element of the panel.
     *
     * - By default option container is set with the string 'window'. That means
     * the panel is appended to the <body> element and positioned fixed within
     * the browser viewport.
     *
     * - A string other than 'window' is assumed to be a selector string which
     * is passed to document.querySelector(). That means that the first element
     * matching the selector is used as container for the panel. The panel is
     * positioned absolute within the container.
     *
     * - If option container is an Object whose property nodeType reads 1 the
     * panel is appended to this object.
     *
     * - If option container does not return a valid container no panel is
     * created and an error panel is shown.
     *
     * ***Important note***:
     * If you set option container to an element other than <body> the container
     *  must have a CSS position value of either 'relative', 'absolute' or
     * 'fixed' in order to have panel positioning work as intended.
     */
    container?: string | HTMLElement

    content?: string | HTMLElement | (() => void)

    /**
     * Gets a resource via XMLHttpRequest and optionally loads the response text
     * into the content section of the panel.
     *
     * - A String value is assumed to be an URL pointing to a resource returning
     * content that is to be used as content of the panel. After successful
     * completion of the request the value of the responseText property is
     * converted to a DocumentFragment and the current content of the panel is
     * replaced with the DocumentFragment.
     * That also executes code in script tags that might be contained in the
     * responseText.
     *
     * - Using an Object allows to configure a more detailed request. If url is
     * the only parameter of the object the result is the same as using a string.
     */
    contentAjax?: string | object

    /**
     * Gets a resource via the Fetch API and optionally loads the response into
     * the content section of the panel.
     *
     * A String value is assumed to be an URL pointing to a resource returning
     * content that is to be used as content of the panel. After successful
     * completion of the request the value of the response property is
     * converted to a DocumentFragment and the current content of the panel is
     * replaced with the DocumentFragment. That also executes code in script
     * tags that might be contained in the responseText.
     *
     * Using an Object allows to configure a more detailed request.If resource
     * is the only parameter of the object the result is the same as using
     * a string.
     */
    contentFetch?: string | object

    /**
     * Sets CSS overflow properties for the content section.
     */
    contentOverflow?: string

    /**
     * Sets the dimensions of the content section of the panel whereas
     * option.panelSize sets the dimensions of the complete panel.
     *
     * To resize an existing panel use the panel method
     * [`resize()`](https://jspanel.de/#methods/resize)
     */
    contentSize?: string | Size

    /**
     * Stores optional custom data.
     *
     * *This option does not influence the shown panel in any way. It's just a
     * place to store optional data of any kind. However, when using the layout
     * extension, the data passed to option data is stored in
     * localStorage/sessionStorage when calling `jsPanel.layout.save()`*
     */
    data?: any

    /**
     * This option configures the dragit interaction.
     *
     * By default a jsPanel is draggable. Default drag handles are the header
     * logo, the titlebar and the footer toolbar (if used). The content section
     * and the header toolbar are not used as drag handle.
     */
    dragit?: object | false

    /**
     * This option adds a footer toolbar to the panel which by default will also
     * act as drag handle.
     *
     * By default the complete footer toolbar including its contents act as
     * drag handle. If you don't want a specific footer element act as drag
     * handle simply add the class 'jsPanel-ftr-btn' to it.
     *
     * To add a toolbar to an existing panel use the panel method addToolbar().
     * The main toolbar element <div class="jsPanel-ftr"></div> is always
     * present, even when you don't configure a toolbar (in this case it's
     * simply hidden).
     *
     * When a toolbar is configured it automatically gets the additional CSS
     * class 'active' in order to show it.
     *
     * So in order to hide/show a configured/existing toolbar you just need to
     * toggle its 'active' class. For example with the global method
     * `jsPanel.toggleClass(panel.footer, 'active')`; where panel is a
     * reference to the panel and footer references the above mentioned toolbar
     * <div>.
     */
    footerToolbar?:
      | string
      | (string | HTMLElement)[]
      | HTMLElement
      | ((panel: Panel) => void)

    /**
     * This option removes or auto show/hides the complete header section.
     *
     * *Remember that removing the header section also removes all default
     * controls. And unless you configure a footer toolbar there's no drag
     * handle either*.
     *
     * *If you 'auto-show-hide' the header section and want the panel to have a
     * border don't use option border. Apply a border to the content section
     * instead as shown in example 2.*
     */
    header?: boolean | string

    /**
     * With this option you can configure which panel controls are shown,
     * set their size and add additional custom controls.
     *
     * *To alter a control's status of an existing panel use the panel method
     * [`setControlStatus()`](https://jspanel.de/#methods/setControlStatus)*
     *
     * *More details on
     * [`headerControls`](https://jspanel.de/#options/headerControls)*
     *
     */
    headerControls?: string | object

    /**
     * This option adds a logo to the top left corner of the panel (left of the
     * header title).
     *
     * *To set or change the logo of an existing panel use the panel method
     * [`setHeaderLogo()`](https://jspanel.de/#methods/setHeaderLogo)*
     */
    headerLogo?: string

    /**
     * This option sets the header title.
     * *To set or change the title of an existing panel use the panel method
     * [`setHeaderTitle()`](https://jspanel.de/#methods/setHeaderTitle)*
     */
    headerTitle?: string | HTMLElement | ((panel: Panel) => string)

    /**
      * This option adds a header toolbar.
      * 
      * To add a toolbar to an existing panel use the panel method addToolbar().
      * 
      * The main toolbar element <div class="jsPanel-hdr-toolbar"></div> is 
      * always present, even when you don't configure a toolbar (in this case
      * it's simply hidden).
      * 
      * When a toolbar is configured it automatically gets the additional CSS
      * class 'active' in order to show it.
      *
      *So in order to hide/show a configured/existing toolbar you just need to
      toggle its 'active' class. For example with the global method
      jsPanel.toggleClass(panel.headertoolbar, 'active');
      where panel is a reference to the panel and headertoolbar references
      the above mentioned toolbar <div>.
      */
    headerToolbar?:
      | string
      | (string | HTMLElement)[]
      | HTMLElement
      | ((panel: Panel) => void)

    /**
     * By default jsPanel uses a set of built-in SVG icons for the controls.
     * If you prefer to use another set of icons you can configure it with
     * this option.
     *
     * Supported are Font Awesome icons, Material Icons and Glyphicons
     * (Bootstrap 3).
     */
    iconfont?:
      | 'fa'
      | 'fas'
      | 'far'
      | 'fal'
      | 'fad'
      | 'material-icons'
      | 'bootstrap'
      | 'glyphicon'
      | Array

    id?: string | (() => string)

    /**
     * This option limits the width and height of a maximized panel in order
     * to keep a specified distance from the top, right, bottom and left
     * boundaries of either the browser viewport (if option container is set to
     * 'window' which is the default) or the panel's parent element.
     */
    maximizedMargin?: number[] | number

    minimizeTo?: string | boolean

    /**
     * Function or array of function to execute immediately before a panel
     * closes, regardless of whether the panel is closed by a user or
     * programmatically. It may also be used to cancel closing of a panel.
     *
     * *More details on
     * [onbeforeClose()](https://jspanel.de/#options/onbeforeclose)*
     */
    onbeforeclose?: FunctionWithPanelInMethod | FunctionWithPanelInMethod[]

    /**
     * Function or array of function to execute immediately before a panel
     * maximizes, regardless of whether the panel is closed by a user or
     * programmatically. It may also be used to cancel maximizing of a panel.
     *
     * *More details on
     * [onbeforeClose()](https://jspanel.de/#options/onbeforemaximize)*
     */
    onbeforemaximize?: FunctionWithPanelInMethod | FunctionWithPanelInMethod[]

    /**
     * Function or array of function to execute immediately before a panel
     * minimizes, regardless of whether the panel is minimized by a user or
     * programmatically. It may also be used to cancel minimizing of a panel.
     */
    onbeforeminimize?: FunctionWithPanelInMethod | FunctionWithPanelInMethod[]

    /**
     * Function or array of function to execute immediately before a panel
     * normalizes, regardless of whether the panel is minimized by a user or
     * programmatically. It may also be used to cancel minimizing of a panel.
     */
    onbeforeminimize?: FunctionWithPanelInMethod | FunctionWithPanelInMethod[]

    /**
     * Function or array of function to execute immediately before a panel
     * smallifies, regardless of whether the panel is minimized by a user or
     * programmatically. It may also be used to cancel minimizing of a panel.
     */
    onbeforeminimize?: FunctionWithPanelInMethod | FunctionWithPanelInMethod[]

    /**
     * Function or array of function to execute immediately before a panel
     * unsmallifies, regardless of whether the panel is smallified by a user or
     * programmatically. It may also be used to cancel minimizing of a panel.
     */
    onbeforeunsmallify?: FunctionWithPanelInMethod | FunctionWithPanelInMethod[]

    /**
     * Function or array of function to execute after a panel closed,
     * regardless of whether the panel was closed by a user or programmatically.
     */
    onclosed?: FunctionWithPanelInMethod | FunctionWithPanelInMethod[]

    /**
     * Function or array of function to execute after a panel fronted
     * (panel was clicked in order to get it to the foreground), regardless of
     * whether the panel was fronted by a user or programmatically.
     */
    onclosed?: FunctionWithPanelInMethod | FunctionWithPanelInMethod[]

    /**
     * Function or array of function to execute after a panel maximized,
     * regardless of whether the panel was maximized by a user or
     * rogrammatically.
     */
    onmaximized?: FunctionWithPanelInMethod | FunctionWithPanelInMethod[]

    /**
     * Function or array of function to execute after a panel minimized,
     * regardless of whether the panel was minimized by a user or
     * programmatically.
     */
    onmaximized?: FunctionWithPanelInMethod | FunctionWithPanelInMethod[]

    /**
     * Function or array of function to execute after a panel normalized,
     * regardless of whether the panel was normalized by a user or[
     * programmatically.
     */
    onnormalized?: FunctionWithPanelInMethod | FunctionWithPanelInMethod[]

    /**
     * Function or array of function to execute after a panel smallified,
     * regardless of whether the panel was smallified by a user or
     * programmatically.
     */
    onsmallified?: FunctionWithPanelInMethod | FunctionWithPanelInMethod[]

    /**
     * Function or array of function to execute after a panel unsmallified,
     * regardless of whether the panel was unsmallified by a user or
     * programmatically.
     */
    onunsmallified?: FunctionWithPanelInMethod | FunctionWithPanelInMethod[]

    /**
     * Function or array of function to execute after a panel changed its
     * status, regardless of whether the panel's status change was initiated
     * by a user or programmatically.
     */
    onstatuschange?: FunctionWithPanelInMethod | FunctionWithPanelInMethod[]

    /**
     * If this option is used a child panel shifts within its parent panel's
     * content section in order to maintain its relative position while the
     * parent panel is resized with the mouse
     *
     * *This option applies only to child panels (panels that are appended to
     * the content section of another panel).*
     */
    onparentresize?: FunctionWithPanelInMethod | FunctionWithPanelInMethod[]

    /**
     * Makes a panel responsive to a window resize event.
     * *This option applies only to panels using option `container: 'window'`
     * which is the default for option container.*
     */
    onwindowresize?: FunctionWithPanelInMethod | FunctionWithPanelInMethod[]

    /**
     * By default a newly created panel has a CSS opacity of 0. Only after most
     * of the panel options are applied and the panel is positioned in the
     * document CSS opacity is set to 1.
     *
     * There might be use cases where you don't want the panel to be visible
     * until a certain action is done (e.g. repositioning a tooltip). If you
     * set option opacity the panel maintains the set value until you explicitly
     * change it.
     */
    opacity?: number

    panelSize?: Size | string

    /**
     * By default all standard panels get a class name composed of `jsPanel-`
     * concatenated with the setting of this option.
     *
     * *Normally you should not use option paneltype at all since it might lead
     * to unexpected behaviour of panels.*
     *
     * *An exception to this general rule could be when you create your own
     * jsPanel extension for a special type of panel.*
     */
    paneltype?:
      | 'standard'
      | 'contextmenu'
      | 'error'
      | 'hint'
      | 'modal'
      | 'tooltip'

    /**
     * Somehow a panel needs to be positioned. By default a panel is centered.
     * Either in the center of the browser viewport or in the center of its
     * parent element depending on the setting of option container.
     *
     * *To reposition an existing panel use the panel method
     * [`reposition()`](https://jspanel.de/#methods/reposition)*
     */
    position?: boolean | object | string

    /**
     * This option configures the resizeit interaction.
     * By default a jsPanel is resizable. Default resize handles are all corners
     * (which resize width and height) and all sides (which resize width or
     * height).
     */
    resizeit?: object | false

    /**
     * Switches a panel's default left-to right text direction to right-to-left
     * text direction.
     */
    rtl?: Rtl

    /**
     * By default a panel is created in a normalized status. This option allows
     * to create a panel already maximized, minimized, smallified or
     * smallifiedmax.
     */
    setStatus?: 'maximized' | 'minimized' | 'smallified' | 'smallifiedmax'

    /**
     * Panel options maximizedMargin, dragit, resizeit and the dragit.snap
     * feature can set some sort of containment. Option syncMargins synchronizes
     * those settings to a common value set by option maximizedMargin.
     */
    syncMargins?: boolean

    /**
     * Replaces the default jsPanel HTML template with a customized one of
     * yourown.
     *
     * Assume you need to make a change to the panel that applies to variety of
     * your panels. Instead of applying this change each time you create a panel
     * you could create a custom panel template incorporating this change and
     * use that template for your panels.
     */
    template?: HTMLElement
  }

  type FunctionWithPanelInMethod = <R = void>(panel: Panel) => R | any

  export type Panel = {
    /**
     * By default every panel gets an ID attribute value composed of the string
     * jsPanel- followed by a number (starting with 1) which is increased by 1
     * with each new panel and only reset on page reload.
     *
     * However, you can assign a specific ID value with this option.
     */
    id: string | (() => string)

    /**
     * This method adds a control to an already existing panel within its controlbar.
     *
     * *More details on [https://jspanel.de/#methods/addControl](https://jspanel.de/#methods/addControl)*
     * @param config
     */
    addControl(config?: object): Panel

    /**
     * This method adds either a header toolbar or a footer toolbar to an already existing panel.
     *
     * @param location
     * @param toolbar
     * @param callback
     *
     * @returns The panel's ID attribute value when the panel was removed successfully, otherwise false.
     */
    addToolbar(
      locatio?: 'header' | 'footer',
      toolbar?: string | Node | Array | Function,
      callback: FunctionWithPanelInMethod
    ): Panel

    /**
     *
     * @param callback
     *
     * @param callback Callback function to execute after the close method was
     * called.
     *  #### Arguments:
     *    - **id** the panel's ID attribute value when the panel was closed
     * successfully. In this case the keyword this inside the function refers to
     * the ID.
     *    - **panel** the panel only when the panel was not closed successfully.
     * In this case the keyword this inside the function refers to the panel.
     */
    close(callback?: (id: string, panel?: Panel) => string): string | false

    /**
     * Closes childpanels. That means the panels which are part of the content
     * of the panel the method is called on.

     * @param callback Callback function to execute after the closeChildpanels
    method was called.
     */
    closeChildpanels(callback?: FunctionWithPanelInMethod): Panel

    /**
     * Removes all content from the content section of the panel the method was
     * called on.
     * @param callback Callback function to execute after the front method was
     * called.
     */
    contentRemove(callback?: FunctionWithPanelInMethod): Panel

    /**
     * Disables or enables the dragit interaction of an existing panel.
     * @param action
     */
    dragit(action: 'enable' | 'disable'): Panel

    /**
     * Moves the panel to the foreground by assigning the highest z-index for
     * all the panels that are in the document.
     * @param callback Callback function to execute after the front method was
     * called.
     */
    front(callback?: FunctionWithPanelInMethod)

    /**
     * A NodeList with all childpanels of the panel the method was called on.
     * @param callback Callback function to execute once for each panel in the NodeList.
     */
    getChildpanels(
      callback?: (panel?: Panel, index?: number, list?: NodeList) => void
    )

    resize(
      size: Size,
      updateCache?: boolean,
      callback?: FunctionWithPanelInMethod
    ): Panel

    /**
     * The `<div class="jsPanel-content">` element containing the panel content.
     */
    content: any
  }

  type JsPanel = {
    modal: JsPanel
    autopositionSpacing?: number
    colorFilled?: number
    colorFilledDark?: number
    colorFilledLight?: number

    /**
     * An array with all built-in color names supported by option theme
     */
    colorNames?: object

    /**
     * An object with all default options applied to a panel
     */
    defaults?: PanelOptions

    /**
     * a number indicating whether jsPanel's error reporting is on or off
     */
    errorReporting?: 0 | 1

    /**
     * In some situations it might be useful to set a specific callback function
     * for all panels you create. Instead of adding this callback to each panel
     * separately you can add it to `jsPanel.globalCallbacks` and it will be
     * called whenever a new panel is created.
     *
     * Each function you add to `jsPanel.globalCallbacks` receives the panel as
     * argument and the keyword `this` inside the function also refers to the
     * panel.
     */
    globalCallbacks?: FunctionWithPanelInMethod

    /**
     * an object with the default SVG icons used for the panel's controls
     * (close button, maximize button, etc.)
     */
    icons?: object

    /**
     * This property returns an array of one or more strings with the names of
     * event types depending on which event APIs are supported by the browser.
     * Internally the handlers for the panel controls listen to the event(s)
     * according to this array.
     */
    pointerdown?: string[]

    /**
     * This property returns an array of one or more strings with the names of
     * event types depending on which event APIs are supported by the browser.
     * Internally the handlers for the panel controls listen to the event(s)
     * according to this array.
     */
    pointermove?: string[]

    /**
     * This property returns an array of one or more strings with the names of
     * event types depending on which event APIs are supported by the browser.
     * Internally the handlers for the panel controls listen to the event(s)
     * according to this array.
     */
    pointerup?: string[]

    /**
     * Returns a string with the jsPanel version like
     */
    version?: string

    /**
     * Returns a string with the exact date/time the main jsPanel javascript
     * file was created like 2021-04-10 09:23
     */
    date?: string

    /**
     * A number with the lowest possible z-index value for the panels in the
     * document
     */
    ziBase?: number

    /**
     * This method appends a script to the head of a document and executes it
     * unless a `<script>` element with exactly the same src attribute value
     * as passed to the method is found within the document.
     *
     * @param src URL with the path pointing to the script to load
     * @param type String with the Internet media type like
     * `application/javascript` of the script to load
     * @param callback optional callback function triggered by the onload event
     * of the added script
     */

    addScript(src: string, type: string, callback: () => void): void

    /**
     * This method provides a basic AJAX functionality.
     * It does all the work behind option contentAjax but can be used for
     * general purpose AJAX requests as well.
     * @param xhrConfig
     */
    ajax(xhrConfig: XhrConfig): void

    /**
     * **This is the one method you don't get around since it is the one
     * generating a panel.**
     *
     * Generate a new Panel
     */
    create(option: PanelOptions): Panel

    /**
     * This method removes all content from node.
     */
    emptyNode(node: any): void

    /**
     * With this method you can extend panels with your own custom properties
     * and/or methods.
     *
     * @param object a plain object with a key:value pair for each property
     * /method you want to add to the panels
     */
    extend(object: { [x: string]: () => void })

    /**
     * This method loads a resource via a Fetch request.
     *
     * It does all the work behind option contentFetch but can be used for
     * general purpose Fetch requests as well.
     */
    fetch(fetchConfig: FetchConfig)

    /**
     * This method searches the document for panels and returns an array with
     * the panels matching condition.
     *
     * @param condition The function receives the current panel to test as
     * argument and the keyword this inside the function also refers to the
     * current panel to test.
     *
     * If omitted condition defaults to
     * ```
     *    function() {return this.classList.contains('jsPanel-standard');}
     * ```
     *
     * @returns Array with all panels matching condition sorted by z-index
     * highest first.
     */
    getPanels(condition?: () => boolean): Panel[]

    /**
     * This method positions element according to position and does all the work
     *  behind [`option` position](https://jspanel.de/#options/position).
     *
     * It can be used to position other elements as well, although it's not very
     * comfortable.
     *
     * @param element Must have a property options of type object that in turn
     * has a key container set with a value as within a jsPanel configuration
     * object.
     *
     * @param element must have a property getScaleFactor of type function
     * returning an object like {x: 1, y: 1} with the scale factors of the
     * element to position.
     *
     * @param position The same kind of positioning object as used with
     * [`option` position](https://jspanel.de/#options/position).
     */
    position(element: any, position: Position)

    /**
     * This method removes one or more CSS classnames from element.
     *
     * @param element The element to remove the classname/s from.
     * @param classnames Either a single classname or a space separated list of
     * classnames to remove.
     */
    remClass(element: any, classnames: string): Element

    /**
     * This method adds one or more CSS classnames to element.
     *
     * @param element The element to add the classname/s to.
     * @param classnames Either a single classname or a space separated list of classnames to add.
     */
    remClass(element: any, classnames: string): Element

    /**
     * This method adds one or more CSS classnames to element.
     *
     * @param element The element to toggle classname/s of.
     * @param classnames Either a single classname or a space separated list of
     * classnames to toggle.
     */
    remClass(element: any, classnames: string): Element

    /**
     * This method sets one or more CSS styles of element defined in stylesobject.
     *
     * @param element The element to style.
     * @param stylesobject A plain object with css property:value pairs of the
     * styles to set.
     *
     * CSS property names can be lowerCamelCase or strings with hyphens (eg:
     * backgroundColor or 'background-color').
     */
    setStyles(element, stylesobject)

    /**
     *
     * @param color May have one of the following values:
     *
     * - A color name according to CSS Color Module Level 3/4 like gray,
     * crimson, forestgreen and so on ...
     * - RGB color value like rgb(120,200,17);
     * - RGBA values can be used but the alpha channel is ignored
     * - HEX color value like `#d5e863` or `#ddd;` (# is optional)
     * - HSL color value like `hsl(90,100%,25%)`
     * - HSLA values can be used but the alpha channel is ignored
     *
     * @returns Array with the following values:
     * - `[0]` HSL value of color
     * - `[1]` HSL value of color lightened by the amount stored in
     * `jsPanel.colorFilledLight`.
     * This color is used as background color of a panel's content section when
     * the theme modifier 'filledlight' is used.
     * - `[2]` HSL value of color darkened by the amount stored in
     * `jsPanel.colorFilled`. This color is used as background color of a
     * panel's content section when the theme modifier 'filled' is used.
     * - `[3]` HEX color value '#000000' or '#ffffff' used as font color if
     * background color is `index[0]`. Which value is used depends on the
     * perceived brightness of the corresponding background color
     * - `[4]` HEX color value '#000000' or '#ffffff' used as font color if
     * background color is `index[1]`. Which value is used depends on the
     * perceived brightness of the corresponding background color
     * - `[5]` HEX color value '#000000' or '#ffffff' used as font color if
     * background color is `index[2]`.Which value is used depends on the
     * perceived brightness of the corresponding background color
     * - `[6]` HSL value of color lightened by the amount stored in
     * `jsPanel.colorFilledDark`. This color is used as background color of a
     * panel's content section when the theme modifier 'filleddark' is used.
     * - `[7]` HEX color value '#000000' or '#ffffff' used as font color if
     * background color is `index[6]`
     */
    calcColors(color: string): string[]

    /**
     * Internally this method is used to provide various color formats based on
     * color.
     * @param color May have one of the following values:
     *  A color name according to CSS Color Module Level 3/4 like gray, crimson, forestgreen and so on ...
     * - RGB color value like rgb(120,200,17)
     * - RGBA values can be used but the alpha channel is ignored
     * - HEX color value like `#d5e863` or `#ddd;` (# is optional)
     * - HSL color value like `hsl(90,100%,25%)`
     * - HSLA values can be used but the alpha channel is ignored
     *
     * @returns Object with color represented in various HEX, RGB, HSL and CSS
     * usable formats
     */
    color(color: string): Colors

    /**
     * Calculates a color value darkened by amount based on color.
     *
     * @param color may have one of the following values:
     * - A color name according to CSS Color Module Level 3/4 like gray,
     * crimson, forestgreen and so on ...
     * - RGB color value like `rgb(120,200,17)`
     * - RGBA values can be used but the alpha channel is ignored
     * - HEX color value like `#d5e863` or `#ddd;` (# is optional)
     * - HSL color value like `hsl(90,100%,25%)`
     * - HSLA values can be used but the alpha channel is ignored
     *
     * @param amount Number in the range 0 to 1.
     * A value of 0.6 for example darkens color by 60%
     * A value of 1 will always return black, a value of 0 returns the same
     * color
     *
     * @returns String with an HSL color value
     *
     */
    darken(color: string, amount: number): string

    /**
     * Calculates a color value lightened by amount based on color.
     *
     * @param color may have one of the following values:
     * - A color name according to CSS Color Module Level 3/4 like gray,
     * crimson, forestgreen and so on ...
     * - RGB color value like `rgb(120,200,17)`
     * - RGBA values can be used but the alpha channel is ignored
     * - HEX color value like `#d5e863` or `#ddd;` (# is optional)
     * - HSL color value like `hsl(90,100%,25%)`
     * - HSLA values can be used but the alpha channel is ignored
     *
     * @param amount Number in the range 0 to 1.
     * A value of 0.6 for example darkens color by 60%
     * A value of 1 will always return black, a value of 0 returns the same
     * color
     *
     * @returns String with an HSL color value
     */
    lighten(color: string, amount: number): string

    /**
     * Calculates perceived brightness based on color.
     * By default a panel's font color for header and content sections are
     * either black or white. This method is internally used to determine which
     * font color the used background color requires.
     *
     * jsPanel uses a white font color for background colors with a perceived
     * brightness of <= 0.55, otherwise black.
     *
     * @param color may have one of the following values:
     * - A color name according to CSS Color Module Level 3/4 like gray,
     * crimson, forestgreen and so on ...
     * - RGB color value like `rgb(120,200,17)`
     * - RGBA values can be used but the alpha channel is ignored
     * - HEX color value like `#d5e863` or `#ddd;` (# is optional)
     * - HSL color value like `hsl(90,100%,25%)`
     * - HSLA values can be used but the alpha channel is ignored
     */
    perceivedBrightness(color)

    /**
     * This utility method returns a DocumentFragment based on string.
     * 
     * Return values from `jsPanel.ajax()` and `jsPanel.fetch()` as well as a
     * response from options contentAjax and contentFetch you need to process
     * in a done callback are just strings. Depending on how you add these
     * strings to your page they might not be rendered as
     * `HTML.jsPanel.strToHtml()` converts a string to a DocumentFragment that
     * will be rendered as HTML and can even be searched with `querySelector()`
     * and similar methods.
     * 
     * @param string A string value with tags and text to convert to a
     * DocumentFragment

     */
    strToHtml(string: string): DocumentFragment
  }

  type Rtl = {
    rtl?: boolean
    lang?: string
  }

  type XhrConfig = object

  type FetchConfig = object

  type Position = object

  type Colors = {
    hex: string
    rgb: {
      css: string
      r: number
      g: number
      b: number
    }
    hsl: {
      css: string
      h: number
      s: string
      l: string
    }
  }
  export const jsPanel: JsPanel
}


declare module '*.json' {
  const value: any
  export default value
}