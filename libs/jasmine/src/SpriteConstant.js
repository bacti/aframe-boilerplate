module.exports =
{
    BSPRITE_v005: 0x05DF, // supported version
    get SUPPORTED_VERSION() { return this.BSPRITE_v005 },
    BS_MODULES:                 1 << 0,
    BS_MODULES_XY:              1 << 1,
    BS_MODULES_IMG:             1 << 2,
    BS_MODULE_IMAGES_TC_BMP:    1 << 3,
    BS_MODULES_WH_SHORT:        1 << 4, // export w, h for each module as short
    BS_MODULES_XY_SHORT:        1 << 5, // export x, y for each module as short
    BS_MODULES_USAGE:           1 << 6, // export for each module which transformations are used in the sprite
    BS_IMAGE_SIZE_INT:          1 << 7, // module size will be stored on int, for larger module
    BS_FRAMES:                  1 << 8,
    BS_FM_OFF_SHORT:            1 << 10, // export fm offsets as shorts
    BS_NFM_SHORT:               1 << 11, // export fmodule count per frame as short
    BS_SKIP_FRAME_RC:           1 << 12, // do not export frame rect
    BS_FRAME_COLL_RC:           1 << 13, // export collision rect
    BS_FM_PALETTE:              1 << 14, // export palette used by the module
    BS_FRAME_RECTS:             1 << 15, // export frame rects
    BS_ANIMS:                   1 << 16,
    BS_NO_AF_START:             1 << 17, // do not export start of AFrames
    BS_AF_OFF_SHORT:            1 << 18, // export af offsets as shorts
    BS_NAF_SHORT:               1 << 19, // export naf as short
    BS_FM_INDEX_SHORT:          1 << 20, // export frame module ID's as shorts
    BS_AF_INDEX_SHORT:          1 << 21, // export animation frame ID's as shorts
    BS_EXTRA_FLAGS:             1 << 22, // if enabled means that there are extra flags exported.
    BS_MODULE_IMAGES_FX:        1 << 23, // export encoded images for each module (flipped horizontally)
    BS_MODULE_IMAGES:           1 << 24,
    BS_PNG_CRC:                 1 << 25,
    BS_KEEP_PAL:                1 << 26,
    BS_TRANSP_FIRST:            1 << 27,
    BS_TRANSP_LAST:             1 << 28,
    BS_SINGLE_IMAGE:            1 << 29,
    BS_MULTIPLE_IMAGES:         1 << 30,
    BS_GIF_HEADER:              1 << 31, // export gif header instead of palet
    get BS_DEFAULT_MIDP2() { return this.BS_MODULES | this.BS_FRAMES | this.BS_ANIMS | this.BS_MODULE_IMAGES },
    get BS_DEFAULT_NOKIA() { return this.BS_DEFAULT_MIDP2 },
    get BS_DEFAULT_MIDP1() { return this.BS_MODULES | this.BS_MODULES_XY | this.BS_FRAMES | this.BS_ANIMS },
    get BS_DEFAULT_MIDP1b() { return this.BS_MODULES | this.BS_FRAMES | this.BS_ANIMS | this.BS_MODULE_IMAGES | this.BS_PNG_CRC },
    get BS_DEFAULT_MIDP1c() { return this.BS_MODULES | this.BS_MODULES_XY | this.BS_FRAMES | this.BS_ANIMS | this.BS_SINGLE_IMAGE },

    //BSprite extra flags0
    BS_EX0_FM_FREE_ROTATE_SCALE:    1 << 0,
    BS_EX0_AF_FREE_ROTATE_SCALE:    1 << 1,
    BS_EX0_MULTIPAL_IMAGE:          1 << 2,
    BS_EX0_MULTI_IMAGE:             1 << 3,
    BS_EX0_FM_BLEND_MODE:           1 << 4, // export blend mode for each frame module. You need to enable GLLibConfig.sprite_useFMBlendMode
    BS_EX0_MODULE_IMAGES_USED:      1 << 5,

    BS_EX0_IMAGES_NAME:         1 << 10,
    BS_EX0_ANIMEX:              1 << 12, // export tween
    BS_EX0_PIVOT_FRAME_ANIM:    1 << 13,
    BS_EX0_MMAPPINGS:           1 << 17, // export module mappings to *.bsprite
    BS_EX0_MM_OFFSET:           1 << 18, // export module offset for mapping
    BS_EX0_MM_OFFSET_SHORT:     1 << 19, // export module offset as short
    BS_EX0_SINGLE_IMAGE_INDEX:  1 << 20, // export image data contain alpha values and RGB palette indices

    BS_EX0_PRIMITIVES_PAL:      1 << 22, // export color (from palette) & image index for primitive modules
    BS_EX0_MODULE_MERGED_ATLAS: 1 << 23, // export module merged atlas
    BS_PALETTE_TYPE:            1 << 24, // export palette type to use blend palette or others in future
    BS_FRAME_POLYGONS:          1 << 26, // export frame polygons collision

    MD_IMAGE:           0,
    MD_RECT:            0xFF,
    MD_FILL_RECT:       0xFE,
    MD_MARKER:          0xFD,
    MD_ARC:             0xFC,
    MD_FILL_ARC:        0xFB,
    MD_TRIANGLE:        0xFA,
    MD_FILL_TRIANGLE:   0xF9,
    MD_LINE:            0xF8,
    MD_FILL_RECT_GRAD:  0xF7,
    MD_MESH:            0xF4,

    // Frames/Anims flags...
    FLAG_FLIP_X:    0x01,
    FLAG_FLIP_Y:    0x02,
    FLAG_ROT_90:    0x04,
    FLAG_HYPER_FM:  0x10, // Hyper FModule, used by FModules
}
