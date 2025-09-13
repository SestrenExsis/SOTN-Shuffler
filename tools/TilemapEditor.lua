
-- Uses lots of tile-finding math from MottZilla's SotN_TileMapFind script

local P = {}
TilemapEditor = P

P.Memory = {
    NoClip = {
        Address = 0x001396EA,
        Type = "u8",
        Value = nil,
    },
    RoomWidth = {
        Address = 0x000730C8,
        Type = "u16le",
        Value = nil,
    },
    BackgroundPointer = {
        Address = 0x00073084,
        Type = "u32le",
        Value = nil,
    },
    ForegroundPointer = {
        Address = 0x000730D8,
        Type = "u32le",
        Value = nil,
    },
    ScrollX = {
        Address = 0x0007308E,
        Type = "u16le",
        Value = nil,
    },
    ScrollY = {
        Address = 0x00073092,
        Type = "u16le",
        Value = nil,
    },
    PlayerX = {
        Address = 0x000973F0,
        Type = "u32le",
        Value = nil,
    },
    PlayerY = {
        Address = 0x000973F4,
        Type = "u32le",
        Value = nil,
    },
}

P.MemoryKeys = {}
for value_name, value in pairs(P.Memory) do
    table.insert(P.MemoryKeys, value_name)
end
table.sort(P.MemoryKeys)

P.text = function(__col, __row, __message, __color)
    local font_height = 12
    local font_width = 8
    if __color == nil then
        __color = 0xff999999
    end
    local x = font_width * (__col + 0.5)
    local y = font_height * (__row + 0.5)
    P.canvas.DrawText(x, y, __message, __color, 0xff000000, font_height)
end

P.draw = function()
    gui.clearGraphics()
    P.canvas.Clear(0xFF000000)
    P.prev_mouse = P.curr_mouse
    P.curr_mouse = input.getmouse()
    local row = 0
    for index, value_name in pairs(P.MemoryKeys) do
        local value = P.Memory[value_name]
        P.text(0, index, value_name)
        P.text(20, index, value.Type)
        P.text(30, index, bizstring.hex(value.Value))
        row = row + 1
    end
    local scroll_col = math.floor(P.Memory.ScrollX.Value / 16)
    local mouse_col = math.floor((P.curr_mouse.X + 2 + (0xF & P.Memory.ScrollX.Value) ) / 16) - 1
    local tile_col = (mouse_col + scroll_col)
    local scroll_row = math.floor(P.Memory.ScrollY.Value / 16)
    local mouse_row = math.floor((P.curr_mouse.Y + 0 + ((0xF & P.Memory.ScrollY.Value))) / 16)
    local tile_row = (mouse_row + scroll_row)
    P.text(0, #P.MemoryKeys + 2, "TileX")
    P.text(30, #P.MemoryKeys + 2, tile_col)
    P.text(0, #P.MemoryKeys + 3, "TileY")
    P.text(30, #P.MemoryKeys + 3, tile_row)
    local bx0 = 16 * (tile_col - scroll_col) - (0xF & P.Memory.ScrollX.Value) + 14
    local by0 = 16 * (tile_row - scroll_row) - (0xF & P.Memory.ScrollY.Value) - 1
    gui.drawBox(bx0, by0, bx0 + 17, by0 + 17, 0xFFFF0000, 0x00000000)
    gui.drawPixel(left, top, 0xFFFFFFFF)
    P.canvas.Refresh()
end

P.update = function()
    P.room_pointer = (0x1FFFFF & mainmemory.read_u32_le(0x73084))
    for v_name, v_props in pairs(P.Memory) do
        if v_props.Type == "u8" then
            v_props.Value = mainmemory.read_u8(v_props.Address)
        elseif v_props.Type == "u16le" then
            v_props.Value = mainmemory.read_u16_le(v_props.Address)
        elseif v_props.Type == "u32le" then
            v_props.Value = mainmemory.read_u32_le(v_props.Address)
        else
            v_props.Value = mainmemory.read_u32_le(v_props.Address)
        end
    end
end

event.unregisterbyname("TilemapEditor__update")
event.onframeend(P.update, "TilemapEditor__update")

gui.defaultBackground(0xffff0000)

P.room_pointer = 0
P.prev_mouse = input.getmouse()
P.curr_mouse = P.prev_mouse
P.data = {}
P.row = 0
P.col = 0
P.scale = 2
P.cursor = 0

P.canvas_width = P.scale * (256)
P.canvas_height = P.scale * (128)
P.canvas = gui.createcanvas(P.canvas_width, P.canvas_height, P.scale * 4, P.scale * 4)
P.canvas.SetTitle("TilemapEditor")

P.update()
while true do
    emu.yield()
    P.draw()
end
