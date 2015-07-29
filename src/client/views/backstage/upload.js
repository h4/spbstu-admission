function FileUploadHandler(event, template, Collection) {
    var input = event.target,
        file = event.target.files[0],
        btn = $(input).closest('.btn');

    btn.addClass('disabled');

    Collection.insert(file, function(err, fileObj) {
        if (err) {
            console.log('Upload error:', err);
        } else {
            template.find('.upload-form').reset();
            btn.removeClass('disabled');
        }
    });
}

function updateSiteSettings(key, value) {
    var doc = {},
        lookup = {},
        existDoc;

    lookup[key] = {$exists: true};
    existDoc = SiteSettings.findOne(lookup);

    doc[key] = value;

    if (existDoc) {
        SiteSettings.update({_id: existDoc._id}, {$set: doc});
    } else {
        SiteSettings.insert(doc);
    }
}

Template.BackstageUpload.events({
    'change #groups': function(event, template) {
        FileUploadHandler(event, template, GroupsFiles);
    },

    'change #counters': function(event, template) {
        FileUploadHandler(event, template, CountersFiles);
    },

    'change #abiturients': function(event, template) {
        FileUploadHandler(event, template, AbiturientsFiles);
    },

    'change #rating-groups': function(event, template) {
        FileUploadHandler(event, template, RatingGroupsFiles);
    },

    'change #rating-list': function(event, template) {
        FileUploadHandler(event, template, RatingFiles);
    },

    'change #showContestGroups': function(event, template) {
        updateSiteSettings('showContestGroups', event.target.checked);
    }
});

Template.BackstageUpload.rendered = function() {
    $('.file-field').each(function() {
        var path_input = $(this).find('input.file-path');

        $(this).find('input[type="file"]').change(function () {
            var files = $(this)[0].files;
            var file_names = [];
            for (var i=0; i < files.length; i++) {
                file_names.push(files[i].name);
            }
            path_input.val(file_names.join(", "));
            path_input.trigger('change');
        });
    });

    $('.collapsible').collapsible({});
};

function _getProgress(collection) {
    return uploadStatus.findOne({name: collection}) && uploadStatus.findOne({name: collection})['value'];
}

Template.BackstageUpload.helpers({
    groupsProgress: function() {
        return _getProgress('groups');
    },
    countersProgress: function() {
        return _getProgress('counters');
    },
    abiturientsProgress: function() {
        return _getProgress('abiturients');
    },
    ratingsProgress: function() {
        return _getProgress('ratings');
    },
    showContestGroupsСhecked: function() {
        var settings = SiteSettings.findOne({'showContestGroups': {$exists: true}});

        if (settings) {
            if (settings['showContestGroups'] == true) {
                return 'checked';
            }
        } else {
            return 'checked';
        }
    }
});
