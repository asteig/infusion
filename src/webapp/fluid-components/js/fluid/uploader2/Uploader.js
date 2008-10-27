/*global jQuery*/
/*global fluid_0_6*/

fluid_0_6 = fluid_0_6 || {};

(function ($, fluid) {
    
    var setState = function (that, stateClass) {
        that.stateDisplay.attr("className", stateClass);
    };
    
    var addState = function (that, stateClass) {
        that.stateDisplay.addClass(stateClass);
    };
    
    var removeState  = function (that, stateClass) {
        that.stateDisplay.removeClass(stateClass);
    };

    var refreshView = function (that) {
        if (that.uploadManager.queue.files.length) {
            setState(that, that.options.styles.queueLoadedState);
        } else {
            setState(that, that.options.styles.queueEmptyState);
        }
    };
    
    var bindDOMEvents = function (that) {
        that.locate("browseButton").click(function () {
            that.uploadManager.browseForFiles();
        });
        
        that.locate("uploadButton").click(function () {
            that.uploadManager.start();
        });
    };
        
    var bindModelEvents = function (that) {
        that.events.onFileBrowse.addListener(function () {
            addState(that, that.options.styles.queueBrowsingState);
        });
        
        that.events.afterFileBrowse.addListener(function () {
            that.refreshView();
        });
        
        that.events.afterFileQueued.addListener(that.fileQueueView.addFile);
    };
   
    var setupUploader = function (that) {
        // Instantiate the upload manager and file queue view, 
        // passing them smaller chunks of the overall options for the uploader.
        that.uploadManager = fluid.initSubcomponent(that, 
                                                    "uploadManager", 
                                                    [that.events, fluid.COMPONENT_OPTIONS]);
        that.fileQueueView = fluid.initSubcomponent(that, 
                                                    "fileQueueView", 
                                                    [that.locate("fileQueue"), 
                                                    that.uploadManager,
                                                    fluid.COMPONENT_OPTIONS]);
        that.stateDisplay = that.locate("stateDisplay");
        
        bindDOMEvents(that);
        bindModelEvents(that);
    };
    
    /**
     * Instantiates a new Uploader component.
     * 
     * @param {Object} container the DOM element in which the Uploader lives
     * @param {Object} options configuration options for the component.
     */
    fluid.uploader = function (container, options) {
        var that = fluid.initView("fluid.uploader", container, options);
        
        /**
         * Refreshes the CSS states for the Uploader based on actual states in the model.
         */
        that.refreshView = function () {
            refreshView(that);
        };
        
        setupUploader(that);
        return that;  
    };
    
    fluid.defaults("fluid.uploader", {
        uploadManager: {
            type: "fluid.swfUploadManager"
        },
        
        fileQueueView: {
            type: "fluid.fileQueueView"
        },
        
        selectors: {
            fileQueue: ".fluid-uploader-queue",
            browseButton: ".fluid-uploader-browse",
            uploadButton: ".fluid-uploader-upload",
            resumeButton: ".fluid-uploader-resume",
            pauseButton: ".fluid-uploader-pause",
            cancelButton: ".fluid-uploader-cancel",
            doneButton: ".fluid-uploader-done",
            totalFileProgressBar: ".total-file-progress",
            stateDisplay: "div:first"
        },
        
        styles: {
            queueEmptyState: "start",
            queueLoadedState: "loaded",
            queueBrowsingState: "browsing"  
        },
        
        events: {
            afterReady: null,
            onFileBrowse: null,
            afterFileQueued: null,
            afterFileRemoved: null,
            onQueueError: null,
            afterFileBrowse: null,
            onUploadStart: null,
            onFileProgress: null,
            onUploadError: null,
            afterFileUploaded: null,
            afterUploadComplete: null
        }
    });
    
   /**
     * Pretty prints a file's size, converting from bytes to kilobytes or megabytes.
     * 
     * @param {Number} bytes the files size, specified as in number bytes.
     */
    fluid.uploader.formatFileSize = function (bytes) {
        if (typeof bytes === "number") {
            if (bytes === 0) {
                return "0.0 KB";
            } else if (bytes > 0) {
                if (bytes < 1048576) {
                    return (Math.ceil(bytes / 1024 * 10) / 10).toFixed(1) + " KB";
                }
                else {
                    return (Math.ceil(bytes / 1048576 * 10) / 10).toFixed(1) + " MB";
                }
            }
        }
        return "";
    };
        
})(jQuery, fluid_0_6);