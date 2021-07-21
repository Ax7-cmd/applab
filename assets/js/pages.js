if (location.protocol !== 'https:' && location.hostname !== "localhost" && location.hostname !== "tadpole-homepage.test") { //force https
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
}

$(document).ready(function () {
    var canvs = document.getElementById("fishHolder");
    canvs.width = window.innerWidth;
    canvs.height = $('.bg-holder').height();
    $('#fishHolder').fishAnimation();

    // load data circulating supply
    var cycXhttp = new XMLHttpRequest();
    cycXhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const obj = JSON.parse(cycXhttp.response);
            $('.cyc-value').html(obj.strValue + ' TAD');
            $('.cyc-percent').html(obj.percent + '%');
            $('.cyc-percent-style').attr('style', 'width: ' + obj.percent + '%');
            $('.cyc-percent-style').attr('aria-valuenow', obj.percent);
            $('.cyc-update').html('* update, ' + obj.updatedAt);
        }
    };
    cycXhttp.open("GET", "//api.npoint.io/f7f14792a99a6209db30", true);
    cycXhttp.send();

    // load market cap rank
    var mcrXhttp = new XMLHttpRequest();
    mcrXhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const obj = JSON.parse(mcrXhttp.response);
            if (obj.market_cap_rank != undefined) {
                $('.mcr').html(obj.market_cap_rank);
            }
        }
    };
    mcrXhttp.open("GET", "https://api.coingecko.com/api/v3/coins/tadpole-finance?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false", true);
    mcrXhttp.send();

    // select lang
    $('.select-lang').on('change', function() {
        if($(this).attr('data-selected') != $(this).val()){
            switch ($(this).val()) {
                case 'id':
                    window.location.replace("/id");
                    break;
                case 'cn':
                    window.location.replace("/cn");
                    break;

                default:
                    window.location.replace("/");
                    break;
            }
        }
    });
});