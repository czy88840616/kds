(function () {
    function getQuery(querystring) {
        var query = {};

        var pairs = querystring.split('&'),
            length = pairs.length,
            keyval = [],
            i = 0;

        for (; i < length; i++) {
            keyval = pairs[i].split('=', 2);
            try {
                keyval[0] = decodeURIComponent(keyval[0]); // key
                keyval[1] = decodeURIComponent(keyval[1]); // value
            } catch (e) {
            }

            if (query[keyval[0]] === undefined) {
                query[keyval[0]] = keyval[1];
            } else {
                query[keyval[0]] += ',' + keyval[1];
            }
        }

        return query;
    }

    function tryControl() {
        JSBIN.counter = setTimeout(function(){
            //5秒之后还在加载，则重试
            if(JSBIN.flushing) {
                var links = $('.jsbin-embed').toArray();
                tryControl();
                embed(links.shift(), links);
            }
        }, JSBIN.timeout);
    }

    function embed(link, links) {
        if(!link) return;
        var iframe = document.createElement('iframe'),
            url = link.href.replace(/edit/, 'embed');
        iframe.src = url;
        iframe._src = url; // support for google slide embed
//        iframe.className = link.className; // inherit all the classes from the link
//        iframe.id = link.id; // also inherit, giving more style control to the user
        iframe.style.border = '1px solid #aaa';

        var query = getQuery(link.search);
        iframe.style.width = query.width || '100%';
        iframe.style.minHeight = query.height || '300px';
        if (query.height) {
            iframe.style.maxHeight = query.height;
        }

        $(iframe).load(function(ev) {
            clearTimeout(JSBIN.counter);

            if(links.length) {
                tryControl();
            }

            embed(links.shift(), links);
        });

        link.parentNode.replaceChild(iframe, link);
    }

    window.JSBIN = {
        flush: function () {
            var links = $('.jsbin-embed').toArray();

            JSBIN.flushing = true;
            tryControl();
            embed(links.shift(), links);
        },
        flushing: false,
        timeout: 6000
    }
})();