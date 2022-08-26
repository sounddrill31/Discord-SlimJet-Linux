// Kent@FlashPeak: toolbar button list class

cr.define('options', function() {
  /** @const */ var ArrayDataModel = cr.ui.ArrayDataModel;
  /** @const */ var DeletableItem = options.DeletableItem;
  /** @const */ var DeletableItemList = options.DeletableItemList;
  /** @const */ var List = cr.ui.List;
  /** @const */ var ListItem = cr.ui.ListItem;
  /** @const */ var ListSingleSelectionModel = cr.ui.ListSingleSelectionModel;

  /**
   * Creates a new Toolbar Button list item.
   * @param {Object} toolButtonInfo The information of the toolButton.
   * @constructor
   * @extends {DeletableItem.ListItem}
   */
  function ToolButtonListItem(toolButtonInfo) {
    var el = cr.doc.createElement('li');
    el.__proto__ = ToolButtonListItem.prototype;
    el.toolbutton_ = toolButtonInfo;
    el.decorate();
    return el;
  };

  ToolButtonListItem.prototype = {
    __proto__: DeletableItem.prototype,

    /**
     * The name of this toolButton.
     * @type {string}
     * @private
     */
    toolButtonName_: null,

    /** @override */
    decorate: function() {
      DeletableItem.prototype.decorate.call(this);

      var toolbuttonName = this.toolbutton_.toolbuttonName;
      var toolbarOptions = options.ToolbarOptions.getInstance();
      this.toolButtonName = toolbuttonName;
      this.toolButtonIcon = this.toolbutton_.toolbuttonIcon;
      this.toolButtonTooltip = this.toolbutton_.displayTooltip;
      this.toolButtonText = this.toolbutton_.displayText;

      var iconEl = cr.doc.createElement('img');
      iconEl.className = 'toolbutton-img';
      iconEl.src = 'images/toolbar_icons/' + this.toolbutton_.toolbuttonIcon + '.png';
      iconEl.draggable = false;
      this.contentElement.appendChild(iconEl);

      this.toolButtonElem = cr.doc.createElement('div');
      this.toolButtonElem.className = 'toolbutton-name';
      //this.toolButtonElem.dir = this.toolbutton_.textDirection;
      this.toolButtonElem.textContent = this.toolbutton_.displayText;
      this.contentElement.appendChild(this.toolButtonElem);
      this.title = this.toolbutton_.displayTooltip;

      this.draggable = true;
    },
  };

  /**
   * Creates a new toolButton available list.
   * @param {Object=} opt_propertyBag Optional properties.
   * @constructor
   * @extends {cr.ui.List}
   */
  var ToolButtonAvailableList = cr.ui.define('list');

  ToolButtonAvailableList.setToolButtonList = function(toolButtonList) {
    this.buttonList_ = toolButtonList;
  }
  ToolButtonAvailableList.getToolButtonList = function() {
    if(this.buttonList_ != undefined) {
      return this.buttonList_;
    }
    return [];
  }
  ToolButtonAvailableList.prototype = {
    __proto__: DeletableItemList.prototype,

    /** @override */
    decorate: function() {
      DeletableItemList.prototype.decorate.call(this);
      this.selectionModel = new ListSingleSelectionModel();
    },

    createItem: function(toolButtonInfo) {
      var item = new ToolButtonListItem(toolButtonInfo);
      item.deletable = false;
      return item;
    },

  };

  /**
   * Creates a new toolButton list.
   * @param {Object=} opt_propertyBag Optional properties.
   * @constructor
   * @extends {cr.ui.List}
   */
  var ToolButtonList = cr.ui.define('list');

  /**
   * Sets list of toolButtons for the available button list
   * @param {Array} toolButtonList ToolButton List
   */
  ToolButtonList.setToolButtonList = function(toolButtonList) {
    this.buttonList_ = toolButtonList;
  }

  /*
   * Gets the toolButton data Model of the listed toolbar buttons.
   */
  ToolButtonList.getToolButtonList = function() {
    if(this.buttonList_ != undefined) {
      return this.buttonList_;
    }
    return [];
  }

  ToolButtonList.prototype = {
    __proto__: DeletableItemList.prototype,

    /** @override */
    decorate: function() {
      DeletableItemList.prototype.decorate.call(this);
      this.selectionModel = new ListSingleSelectionModel;
    },

    createItem: function(toolButtonInfo) {
      var item = new ToolButtonListItem(toolButtonInfo);
      item.deletable = false;
      return item;
    },

  };

  return {
    ToolButtonAvailableList: ToolButtonAvailableList,
    ToolButtonList: ToolButtonList,
    ToolButtonListItem: ToolButtonListItem
  };
});
//END OF Kent@FlashPeak: toolbar button list class