const socket = io('http://localhost:3000');

socket.on('attendances', (data) => {
    const allAttendance = $('#all-attendance');

    allAttendance.html('');
    
    allAttendance.append(`<h1>All Attendance</h1>`);

    if(data.length > 0){
        data.map(attendance => {    
            allAttendance.append(`
                preferential: ${attendance.preferential}<br>
                attendance_id: ${attendance.id}
                <br>
            `);
        });
    } else {
        allAttendance.append(`<h1>No Attendance</h1>`);
    }
});

socket.on('next-attendance', (data) => {
    const nextAttendance = $('#next-attendance');

    nextAttendance.html('');

    nextAttendance.append(`<h1>Next Attendance</h1>`);

    if(data.length > 0){
        data.map(attendance => {    
            nextAttendance.append(`
                preferential: ${attendance.preferential}<br>
                attendance_id: ${attendance.id}
                <br>
            `);
        });
    } else {
        nextAttendance.append(`<h1>No Attendance</h1>`);
    }
});

socket.on('next-preferential-attendance', (data) => {
    const nextAttendance = $('#next-preferential-attendance');

    nextAttendance.html('');

    nextAttendance.append(`<h1>Next Attendance</h1>`);

    if(data.length > 0){
        data.map(attendance => {    
            nextAttendance.append(`
                preferential: ${attendance.preferential}<br>
                attendance_id: ${attendance.id}
                <br>
            `);
        });
    } else {
        nextAttendance.append(`<h1>No Attendance</h1>`);
    }
});

$('#next-attendance').click((event) => {
    event.preventDefault();

    socket.emit('next-attendance');
});

$('#next-preferential-attendance').click((event) => {
    event.preventDefault();

    socket.emit('next-preferential-attendance');
});

$('#new-preferential-attendance').click((event) => {
    event.preventDefault();

    socket.emit('new-preferential-attendance');
});

$('#new-attendance').click((event) => {
    event.preventDefault();

    socket.emit('new-attendance');
});