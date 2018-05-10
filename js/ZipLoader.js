const JSZip = require('jszip')

resource.load_buffer(resource.get_embed_src('data/jasmine.zip'), response =>
{
    var zip = new JSZip()
    zip.loadAsync(response).then(zip =>
    {
        for (let filename in zip.files)
        {
            console.log(filename)
            console.log(zip.files[filename])
            zip.file(filename).async('string').then(data =>
            {
                let json = JSON.parse(data)
                console.log(data)
                console.log(json)
            })
        }
    })
})

export default class ZipLoader
{

}