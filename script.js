document.addEventListener("DOMContentLoaded", function ()
{
    let version = false
    fetch("https://ddragon.leagueoflegends.com/api/versions.json")
        .then(response => response.json())
        .then(data => version = data[0])

    Promise.all([
        fetch("rotation.json").then(res => res.json()),
        fetch("images2.json").then(res => res.json())
    ])
        .then(([rotationData, urlMap]) =>
        {
            const table = new Tabulator("#table", {
                data: rotationData,
                layout: "fitDataStretch",

                pagination: "local",
                paginationSize: 30,
                initialSort: [{ column: "date", dir: "desc" }],
                columns: [
                    {
                        title: "Date",
                        field: "date",
                        sorter: "datetime",
                        sorterParams: { format: "M/d/yy" }
                    },
                    { title: "Name", field: "name" },
                    { title: "Type", field: "type" },
                    {
                        title: "Preview",
                        field: "name",
                        hozAlign: "center",
                        formatter: (cell) =>
                        {
                            const name = cell.getValue()
                            const champion = cell.getRow().getData().champion
                            if (!champion || !urlMap[champion] || !urlMap[champion][name]) return ""

                            const data = urlMap[champion][name]
                            const span = document.createElement("span")
                            span.textContent = "--><--"

                            const preview = document.getElementById("hover-preview")
                            const row = cell.getRow().getElement()

                            let src = ""

                            if (data.type === "icon" && data.id)
                            {
                                src = `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${data.id}.png`
                            }
                            else if (data.type === "skin" && data.champion && data.id !== undefined)
                            {
                                src = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${data.champion}_${data.id}.jpg`
                            }
                            else if (data.type === "chroma" && data.url)
                            {
                                src = `https://wiki.leagueoflegends.com/en-us/images/${data.url}`
                            }

                            if (!src) return span

                            row.addEventListener("mousemove", (e) =>
                            {
                                preview.style.left = (e.pageX + 15) + "px"
                                preview.style.top = (e.pageY + 15) + "px"
                            })

                            row.addEventListener("mouseenter", () =>
                            {
                                preview.src = src
                                preview.style.display = "block"
                            })

                            row.addEventListener("mouseleave", () =>
                            {
                                preview.style.display = "none"
                                preview.src = ""
                            })

                            return span
                        }

                    }
                ]
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
})