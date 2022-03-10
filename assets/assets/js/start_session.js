var channel = pusher.subscribe('esd');

function start_session() {
    document.getElementById('loader1').style.display = 'block';
    document.getElementById('error').style.display = "none";
    document.getElementById('start_session').style.display = 'none';
    
    $.get('/session/check_data', (data) => {
        if (data.success === false) {
            document.getElementById('loader1').style.display = 'none';
            document.getElementById('error').style.display = "block";
            document.getElementById('start_session').style.display = 'block';
            document.getElementById('error_message').innerHTML = data.message;

        }
        else if (data.success === true) {
            document.getElementById('loader1').style.display = 'none';
            document.getElementById('error').style.display = "none";
            document.getElementById('clock').style.display = 'block';
            document.getElementById('end_session').style.display = 'block';
            startTime()
            $.post('/session/start_session', {
                data: data.path
            }, (data) => {
                console.log(data)
                channel.bind('failed', function (data_) {

                   console.log(data_)

                });

                

            })

        }
    })
}

function startTime() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('current_time').innerHTML = h + ":" + m + ":" + s;
    setTimeout(startTime, 1000);
}

function checkTime(i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
}