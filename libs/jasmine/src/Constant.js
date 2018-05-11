module.exports =
{
    // general flags
    EXPORT_QUALITY_FREE_TRANSFORM:  (1 << 0),
    EXPORT_MULTI_MODULE_TYPE:  (1 << 1),
    EXPORT_COLOR_TRANSFORM:  (1 << 2),
    EXPORT_REARRANGE_TEXTURE:  (1 << 3),
    EXPORT_SINGLE_PNG_IMAGE:  (1 << 4),

    // quality type
    EXPORT_QUALITY_TRUE_COLOR:  (1 << 0),
    EXPORT_QUALITY_INDEX_COLOR:  (1 << 1),

    // image data type
    EXPORT_TYPE_3D_TEXTURE:  (1 << 0),
    EXPORT_TYPE_MODULE_IMAGE:  (1 << 1),
    EXPORT_TYPE_SINGLE_IMAGE:  (1 << 2),

    // pixel format type
    EXPORT_PIXEL_32BITS:  (1 << 0),
    EXPORT_PIXEL_16BITS:  (1 << 1),

    // image format
    IMAGE_FORMAT_INDEX:  (1 << 0),
    IMAGE_FORMAT_INDEX_ALPHA:  (1 << 1),
    IMAGE_FORMAT_RAW_0888:  (1 << 2),
    IMAGE_FORMAT_RAW_8888:  (1 << 3),
    IMAGE_FORMAT_RAW_1888:  (1 << 4),
    IMAGE_FORMAT_PNG:  (1 << 5),
    IMAGE_FORMAT_JPG:  (1 << 6),
    IMAGE_FORMAT_ETC1:  (1 << 7),

    // mode
    OPACITY:        1 << 5,
    FREE_TRANSFORM: 1 << 6,

    // alignment
    LEFT:  (1 << 0),
    RIGHT:  (1 << 1),
    HCENTER:  (1 << 2),
    TOP:  (1 << 3),
    BOTTOM:  (1 << 4),
    VCENTER:  (1 << 5),

    // VSpriteFrame
    TYPE_UNKNOWN: -1,
    TYPE_MODULE: 0,
    TYPE_FRAME: 1,
    TYPE_ANIM_FRAME: 2,
}
