const listenToBookslot = () => {
    state.Bloodbank.events
        .Bookslot()
        .on("data", (event) => {
            console.log(event);
            alert("New slot is added");
        })
        .on("error", (error, data) => {
            console.log(error, data);
        });
};

