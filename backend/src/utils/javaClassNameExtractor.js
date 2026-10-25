export function javaClassName(code) {
    let classTokenIndex = code.indexOf("class");
    let curlybraceTokenIndex = code.indexOf("{");
    if (classTokenIndex >= 0 && curlybraceTokenIndex > 0) {
        let subCode = code.substring(
            classTokenIndex + "class".length,
            curlybraceTokenIndex
        );
        return subCode.trim();
    } else {
        return false;
    }
}