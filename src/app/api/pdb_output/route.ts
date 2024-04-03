export const POST = async (req: Request) => {
    try {
        const { pdbContent } = await req.json();

        const headers = new Headers();
        headers.append("Content-Disposition", "attachment; filename=example.rib");
        headers.append("Content-Type", "application/octet-stream");

        const blob = new Blob([pdbContent], { type: "application/octet-stream" });

        return new Response(blob, {
            status: 200,
            headers: headers
        });
    } catch (e) {
        return new Response("Error", { status: 500 });
    }
};
