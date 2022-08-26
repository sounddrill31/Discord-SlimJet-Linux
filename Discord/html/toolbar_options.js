// Kent@FlashPeak: toolbar options class

cr.define('options', function() {
  var OptionsPage = options.OptionsPage;
  var ArrayDataModel = cr.ui.ArrayDataModel;
  var DeletableItem = options.DeletableItem;
  var DeletableItemList = options.DeletableItemList;
  var List = cr.ui.List;
  var ListItem = cr.ui.ListItem;
  var ListSingleSelectionModel = cr.ui.ListSingleSelectionModel;
  var AvailableToolButtonList = options.ToolButtonAvailableList;
  var CurrentToolButtonList = options.ToolButtonList;
  var ArrayDataModel = cr.ui.ArrayDataModel;

  function ToolbarOptions(model) {

  }

  cr.addSingletonGetter(ToolbarOptions);

  // Inherit ToolbarOptions from Page.
  ToolbarOptions.prototype = {
    // __proto__: Page.prototype,
    // The preference is a CSV string that describes visible toolbar buttons
    // list in "Appearance.Customize Toolbar" options page.
    visibleToolbarButtonsPref: 'browser.visible_toolbar_buttons',
    /**
     * The toolbar buttons
     * @type {Array}
     * @private
     */
    currentToolButtonNames_:  [],
    availableToolButtonList_: [],
    currentToolButtonList_: [],

    initializePage: function() {

      var availableButtonList = $('available-button-list');
      AvailableToolButtonList.decorate(availableButtonList);
      var currentButtonList = $('current-button-list');
      CurrentToolButtonList.decorate(currentButtonList);

      // Listen to drag and drop events.
      $('available-button-list').addEventListener('dragstart', this.handleDragStart_.bind(this));
      $('available-button-list').addEventListener('dragenter', this.handleDragEnter_.bind(this));
      $('available-button-list').addEventListener('dragover', this.handleDragOver_.bind(this));
      $('available-button-list').addEventListener('drop', this.handleDrop_.bind(this));
      $('available-button-list').addEventListener('dragleave', this.handleDragLeave_.bind(this));
      $('current-button-list').addEventListener('dragstart', this.handleDragStart_.bind(this));
      $('current-button-list').addEventListener('dragenter', this.handleDragEnter_.bind(this));
      $('current-button-list').addEventListener('dragover', this.handleDragOver_.bind(this));
      $('current-button-list').addEventListener('drop', this.handleDrop_.bind(this));
      $('current-button-list').addEventListener('dragleave', this.handleDragLeave_.bind(this));

    },


    /*
     * Computes the target item of drop event.
     * @param {Event} e The drop or dragover event.
     * @private
     */
    getTargetFromDropEvent_: function(e) {
      var target = e.target;
      // e.target may be an inner element of the list item
      while (target != null && !(target instanceof ListItem)) {
        target = target.parentNode;
      }
      return target;
    },

    /*
     * Handles the dragstart event.
     * @param {Event} e The dragstart event.
     * @private
     */
    handleDragStart_: function(e) {
      var target = e.target;
      // ListItem should be the only draggable element type in the page,
      // but just in case.
      if (target instanceof ListItem) {
        this.draggedItem = target;
        e.dataTransfer.effectAllowed = 'move';
        // We need to put some kind of data in the drag or it will be
        // ignored.  Use the display name in case the user drags to a text
        // field or the desktop.
        e.dataTransfer.setData('text/plain', target.title);
      }
    },

    /*
     * Handles the dragenter event.
     * @param {Event} e The dragenter event.
     * @private
     */
    handleDragEnter_: function(e) {
      e.preventDefault();
    },

    /*
     * Handles the dragover event.
     * @param {Event} e The dragover event.
     * @private
     */
    handleDragOver_: function(e) {
      this.hideDropMarker_();

      var toolButton = this.draggedItem;
      var dstButtonList;
      var srcButtonList;
      var dropTargetToolbuttonName='';
      var dropTarget = this.getTargetFromDropEvent_(e);
      if(dropTarget == null) {  // no button at the list
        if($('available-button-list')== e.srcElement){
          dstButtonList=$('available-button-list').dataModel;
          srcButtonList=$('current-button-list').dataModel;
        }else if($('current-button-list')== e.srcElement) {
          dstButtonList=$('current-button-list').dataModel;
          srcButtonList=$('available-button-list').dataModel;
        }else{
          return;
        }
      }else{
        dropTargetToolbuttonName=dropTarget.toolButtonName;
      }

      if(dropTargetToolbuttonName != '') {
        dstButtonList=$('available-button-list').dataModel;
        srcButtonList=$('available-button-list').dataModel;
        var n = 0;
        var currentButtonItems=$('current-button-list').dataModel;
        var itemName;
        for (n=0;n<currentButtonItems.length;n++){
          itemName=currentButtonItems.item(n).toolbuttonName;
          if(itemName == dropTargetToolbuttonName){
            dstButtonList=$('current-button-list').dataModel;
          }else if(itemName == toolButton.toolButtonName){
            srcButtonList=$('current-button-list').dataModel;
          }
        }
      }

      // Disable drop from availableList to availableList
      if(dstButtonList==$('available-button-list').dataModel &&
        srcButtonList==$('available-button-list').dataModel) {
        return;
      }

      // Disable drop line while drag butotn from current-list to available-list
      if(dstButtonList==$('available-button-list').dataModel){
        e.preventDefault();
        return;
      }

      // Determines whether the drop target is to accept the drop.
      // The drop is only successful on another ListItem.
      if (!(dropTarget instanceof ListItem) ||
        dropTarget == this.draggedItem) {

        e.preventDefault();
        return;
      }
      // Compute the drop postion. Should we move the dragged item to
      // below or above the drop target?
      var rect = dropTarget.getBoundingClientRect();
      var dy = e.clientY - rect.top;
      var yRatio = dy / rect.height;
      var dropPos = yRatio <= .5 ? 'above' : 'below';
      this.dropPos = dropPos;
      this.showDropMarker_(dropTarget, dropPos);
      e.preventDefault();
    },

    /*
     * Handles the drop event.
     * @param {Event} e The drop event.
     * @private
     */
    handleDrop_: function(e) {
      // Drop to toolbutton list
      var toolButton = this.draggedItem;
      this.hideDropMarker_();
      var dstButtonList;
      var srcButtonList;
      var dropTargetToolbuttonName='';
      var dropTarget = this.getTargetFromDropEvent_(e);
      if(dropTarget == null) {  // no button at the list
        if($('available-button-list')== e.srcElement){
          dstButtonList=$('available-button-list').dataModel;
          srcButtonList=$('current-button-list').dataModel;
        }else if($('current-button-list')== e.srcElement) {
          dstButtonList=$('current-button-list').dataModel;
          srcButtonList=$('available-button-list').dataModel;
        }else{
          return;
        }
      }else{
        dropTargetToolbuttonName=dropTarget.toolButtonName;
      }

      if(dropTargetToolbuttonName != "") {
        dstButtonList=$('available-button-list').dataModel;
        srcButtonList=$('available-button-list').dataModel;
        var n = 0;
        var currentButtonItems=$('current-button-list').dataModel;
        var itemName;
        for (n=0;n<currentButtonItems.length;n++){
          itemName=currentButtonItems.item(n).toolbuttonName;
          if(itemName == dropTargetToolbuttonName){
            dstButtonList=$('current-button-list').dataModel;
          }else if(itemName == toolButton.toolButtonName){
            srcButtonList=$('current-button-list').dataModel;
          }
        }
      }

      // Disable drop from availableList to availableList
      if(dstButtonList==$('available-button-list').dataModel &&
        srcButtonList==$('available-button-list').dataModel) {
        return;
      }

      // Delete the toolButton from the original position.
      var i = 0;
      var originalIndex = -1;
      //this.dataModel.indexOf(toolButton);
      for (i=0; i<srcButtonList.length;i++){
        if(srcButtonList.item(i).toolbuttonName == toolButton.toolButtonName){
          originalIndex=i;
          break;
        }
      }
      if (originalIndex == -1) {
        return;
      }
      srcButtonList.splice(originalIndex, 1);

      // Insert the toolButton to the new position.
      var newIndex = -1;

      // drop to end of list while drag butotn from current-list to available-list
      if(dstButtonList==$('available-button-list').dataModel){
        dropTargetToolbuttonName = '';
      }

      if(dropTargetToolbuttonName != '') {
        for (i=0; i<dstButtonList.length;i++){
          if(dstButtonList.item(i).toolbuttonName == dropTargetToolbuttonName){
            newIndex=i;
            break;
          }
        }
        if (newIndex == -1) {
          return;
        }
      }else{
        this.dropPos = 'below';
        newIndex = dstButtonList.length - 1;
      }

      if (this.dropPos == 'below')
        newIndex += 1;

      var toolButtonObj = {
        'toolbuttonName':toolButton.toolButtonName,
        'toolbuttonIcon':toolButton.toolButtonIcon,
        'displayText':toolButton.toolButtonText,
        'displayTooltip':toolButton.toolButtonTooltip
      };
      dstButtonList.splice(newIndex, 0, toolButtonObj);
      // Save the modifies.
      this.saveToolButtonList_();
    },

    /*
     * Handles the dragleave event.
     * @param {Event} e The dragleave event
     * @private
     */
    handleDragLeave_: function(e) {
      this.hideDropMarker_();
    },

    /*
     * Shows and positions the marker to indicate the drop target.
     * @param {HTMLElement} target The current target list item of drop
     * @param {string} pos 'below' or 'above'
     * @private
     */
    showDropMarker_: function(target, pos) {
      window.clearTimeout(this.hideDropMarkerTimer_);
      var marker = $('toolbar-options-list-dropmarker');
      var rect = target.getBoundingClientRect();
      var markerHeight = 8;
      if (pos == 'above') {
        marker.style.top = (rect.top - markerHeight / 2) + 'px';
      } else {
        marker.style.top = (rect.bottom - markerHeight / 2) + 'px';
      }
      marker.style.width = rect.width + 'px';
      marker.style.left = rect.left + 'px';
      marker.style.display = 'block';
    },

    /*
     * Hides the drop marker.
     * @private
     */
    hideDropMarker_: function() {
      // Hide the marker in a timeout to reduce flickering as we move between
      // valid drop targets.
      window.clearTimeout(this.hideDropMarkerTimer_);
      this.hideDropMarkerTimer_ = window.setTimeout(function() {
        $('toolbar-options-list-dropmarker').style.display = '';
      }, 100);
    },


    saveToolButtonList_: function() {
      var visible_toolbar_buttons = [];
      var buttonNames=$('current-button-list').dataModel.array_;
      for(var i=0; i<buttonNames.length; i++){
        visible_toolbar_buttons.push(buttonNames[i].toolbuttonName);
      }
      document.sjReturnValue = visible_toolbar_buttons.join(',');
        if (visible_toolbar_buttons.length==0) {
            location = 'sjcmd://save_toolbuttons :RESET:';
        } else {
            location = 'sjcmd://save_toolbuttons ' + document.sjReturnValue;
        }
    },

    loadToolButtonList_: function() {
	    if ( this.availableToolButtonList_ == undefined ) {
				return;
	    }

      {
        var currentButtonNames=this.currentToolButtonNames_ ;
        var toolButtons=this.availableToolButtonList_;
        var currentButtonList = [];
        var availableButtonList = [];
        var buttonNames = [];
        if (toolButtons.length > 0){
          var i = 0;
          for (i=0; i<currentButtonNames.length; i++) {
            var buttonName = currentButtonNames[i].toolbuttonName;
            var buttonInfo = this.getToolButtonInfoFromButtonName_(buttonName);
            if(buttonInfo != undefined) {
              currentButtonList.push(buttonInfo);
              buttonNames.push(buttonName);
            }
          }
          CurrentToolButtonList.setToolButtonList(currentButtonList);
          this.currentToolButtonList_ = currentButtonList;

          for (i=0; i<toolButtons.length; i++){
            if(buttonNames.indexOf(toolButtons[i].toolbuttonName) == -1){
              availableButtonList.push(toolButtons[i]);
            }
          }

          AvailableToolButtonList.setToolButtonList(availableButtonList);
        }

        delete $('available-button-list').dataModel;
        $('available-button-list').dataModel = new ArrayDataModel(AvailableToolButtonList.getToolButtonList());
        $('available-button-list').redraw();
        

        delete $('current-button-list').dataModel;
        $('current-button-list').dataModel = new ArrayDataModel(CurrentToolButtonList.getToolButtonList());
        $('current-button-list').redraw();
      }
    },

    /**
     * Handles OptionsPage's visible property change event.
     * @param {Event} e Property change event.
     * @private
     */
    handleVisibleChange_: function(e) {
      this.loadToolButtonList_();
    },

    /**
     * Handles visible toolbar buttons pref change.
     * @param {Event} e The change event object.
     * @private
     */
    handleVisibleToolbarButtonsPrefChange_: function(e) {
      var toolButtonNamesInCsv = e.value.value;
      var toolButtonNames = toolButtonNamesInCsv.split(',');

      this.currentToolButtonList_ = toolButtonNames;

      var currentButtonNames = [];
      for(var i=0;i<toolButtonNames.length;i++){
        var toolButton={'toolbuttonName': toolButtonNames[i]};
        currentButtonNames.push(toolButton);
      }
      this.currentToolButtonNames_ = currentButtonNames;
      this.loadToolButtonList_();
    },

    getToolButtonInfoFromButtonName_: function(toolButtonName) {
      // Build the toolbutton name to toolbutton info dictionary at first time.
      if (this.toolButtonNameToToolButtonInfo_ == undefined) {
        this.toolButtonNameToToolButtonInfo_ = {};
        var buttonList = this.availableToolButtonList_;
        for (var i = 0; i < buttonList.length; i++) {
          var buttonInfo = buttonList[i];
          this.toolButtonNameToToolButtonInfo_[buttonInfo.toolbuttonName] = buttonInfo;
        }
      }

      return this.toolButtonNameToToolButtonInfo_[toolButtonName];
    },

    setAvailableButtonList_: function(buttonsList) {
      this.availableToolButtonList_ = buttonsList;
    },
    setCurrentToolButtonList_: function(buttonsList) {
      this.currentToolButtonNames_ = buttonsList;
    },

  };

  ToolbarOptions.setAvailableButtonList = function(entries) {
    ToolbarOptions.getInstance().setAvailableButtonList_(entries);
  };
  ToolbarOptions.setCurrentToolButtonList = function(entries) {
    ToolbarOptions.getInstance().setCurrentToolButtonList_(entries);
		//Kent@FlashPeak, #10163
    ToolbarOptions.getInstance().handleVisibleChange_();
  };

  return {
    ToolbarOptions: ToolbarOptions
  };
});
//END OF Kent@FlashPeak: toolbar options class