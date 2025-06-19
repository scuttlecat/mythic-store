let table

fetch("rotation.json")
    .then(res => res.json())
    .then(data =>
    {
        table = new Tabulator("#table",
            {
                data: data,
                layout: "fitDataStretch",
                height: "600px",
                pagination: "local",
                paginationSize: 50,
                initialSort: [{
                    column: "date",
                    dir: "desc"
                }],
                columns: [{
                    title: "Date",
                    field: "date",
                    sorter: "datetime",
                    sorterParams: {
                        format: "MM/DD/YY"
                    },
                },
                {
                    title: "Name",
                    field: "name"
                },
                {
                    title: "Type",
                    field: "type"
                },
                ],
            })
    })

document.getElementById("search").addEventListener("input", function ()
{
    const query = this.value.toLowerCase()
    table.setFilter([
        [{
            field: "name",
            type: "like",
            value: query
        },
        {
            field: "type",
            type: "like",
            value: query
        },
        ],
    ])
})

fetch("rotation.json", {
    method: "HEAD"
}).then(res =>
{
    const lastModified = res.headers.get("Last-Modified");
    if (lastModified)
    {
        const modifiedDate = new Date(lastModified);
        document.getElementById("last-updated").textContent =
            "Last updated: " + modifiedDate.toLocaleDateString();
    }
})