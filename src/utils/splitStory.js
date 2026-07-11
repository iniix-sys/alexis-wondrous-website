export default function splitStory(
    text,
    maxWords = 900
){

    const blocks = text
        .split(/\n\s*\n/)
        .map(block => block.trim())
        .filter(Boolean);


    const pages = [];

    let current = [];

    let wordCount = 0;


    for(let i = 0; i < blocks.length; i++){

        let block = blocks[i];


        /*
            Keep markdown headings attached
            to the paragraph below them
        */
        if(
            block.startsWith("#") &&
            i + 1 < blocks.length
        ){

            block += "\n\n" + blocks[i + 1];

            i++;

        }



        const words =
            block
                .split(/\s+/)
                .length;



        if(
            wordCount + words > maxWords &&
            current.length > 0
        ){

            pages.push(
                current.join("\n\n")
            );


            current = [];

            wordCount = 0;

        }



        current.push(block);

        wordCount += words;

    }



    if(current.length > 0){

        pages.push(
            current.join("\n\n")
        );

    }



    return pages;

}