
-- Special thanks to Mottzilla for their SotN_TileMapFind script, which formed the basis for a lot of the math and address lookups

local P = {}
TilemapEditor = P

P.Memory = {
    NoClip = {
        Address = 0x001396EA,
        Type = "u8",
        Value = nil,
    },
    ForegroundPointer = {
        Address = 0x00073084,
        Type = "u32le",
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
    RoomHeight = {
        Address = 0x000730CC,
        Type = "u16le",
        Value = nil,
    },
    RoomWidth = {
        Address = 0x000730C8,
        Type = "u16le",
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
}

P.MemoryKeys = {}
for value_name, value in pairs(P.Memory) do
    table.insert(P.MemoryKeys, value_name)
end
table.sort(P.MemoryKeys)

P.text = function(__col, __row, __message, __color)
    local font_height = 12 * P.scale
    local font_width = 8 * P.scale
    if (__color == nil) then
        __color = 0xFF999999
    end
    local x = font_width * (__col + 0.5)
    local y = font_height * (__row + 0.5)
    P.canvas.DrawText(x, y, __message, __color, 0xFF000000, font_height)
end

P.update_input = function()
    P.prev_keys = P.curr_keys
    P.curr_keys = input.get()
    P.prev_mouse = P.curr_mouse
    P.curr_mouse = input.getmouse()
    -- Update columns
    P.prev_col = P.curr_col
    P.scroll_col = math.floor(P.Memory.ScrollX.Value / 16)
    P.mouse_col = math.floor((P.curr_mouse.X + (0xF & P.Memory.ScrollX.Value) + 2) / 16) - 1
    P.curr_col = (P.mouse_col + P.scroll_col)
    -- Update rows
    P.prev_row = P.curr_row
    P.scroll_row = math.floor(P.Memory.ScrollY.Value / 16)
    P.mouse_row = math.floor((P.curr_mouse.Y + (0xF & P.Memory.ScrollY.Value) + 0) / 16)
    P.curr_row = (P.mouse_row + P.scroll_row)
    local width_in_tiles = (P.Memory.RoomWidth.Value / 16)
    local height_in_tiles = (P.Memory.RoomHeight.Value / 16)
    local tile_offset = 2 * ((width_in_tiles * P.curr_row) + P.curr_col)
    local fg_offset = (0x1FFFFF & P.Memory.ForegroundPointer.Value)
    local fg_address = fg_offset + tile_offset
    local bg_address = fg_address + 2 * width_in_tiles * height_in_tiles
    local edit_ind = false
    -- Handle key input: Switch mode
    if (P.curr_keys.X and (P.prev_keys.X == nil or P.prev_keys.X == false)) then
        if P.mode == "FOREGROUND" then
            P.mode = "BACKGROUND"
        else
            P.mode = "FOREGROUND"
        end
    end
    -- Handle key input: Erase tile edit
    if (P.curr_keys.Z) then
        local address = fg_address
        if P.mode == "BACKGROUND" then
            address = bg_address
        end
        if P.edits[address] ~= nil then
            local original_value = P.edits[address].OriginalValue
            memory.write_u16_le(address, original_value)
            P.edits[address] = {
                OriginalValue = original_value,
                CurrentValue = original_value,
                Layer = P.mode,
                Col = P.curr_col,
                Row = P.curr_row,
            }
            edit_ind = true
        end
    end
    -- Handle key input: Toggle highlights
    if (P.curr_keys.A and (P.prev_keys.A == nil or P.prev_keys.A == false)) then
        P.highlightEdits = not(P.highlightEdits)
    end
    -- Handle mouse input: Read tile
    if (P.curr_mouse.Left == true) then
        if (P.mode == "FOREGROUND") then
            P.fg_tile_data = memory.read_u16_le(fg_address)
        elseif (P.mode == "BACKGROUND") then
            P.bg_tile_data = memory.read_u16_le(bg_address)
        end
    end
    -- Handle mouse input: Write tile
    if (P.curr_mouse.Right == true) then
        local address = fg_address
        local tile_data = P.fg_tile_data
        if P.mode == "BACKGROUND" then
            address = bg_address
            tile_data = P.bg_tile_data
        end
        local original_value = memory.read_u16_le(address)
        if P.edits[address] ~= nil then
            original_value = P.edits[address].OriginalValue
        end
        memory.write_u16_le(address, tile_data)
        P.edits[address] = {
            OriginalValue = original_value,
            CurrentValue = tile_data,
            Layer = P.mode,
            Col = P.curr_col,
            Row = P.curr_row,
        }
        edit_ind = true
    end
    -- Update edits
    if edit_ind then
        P.edit_count = 0
        local current_edits = {}
        for address, value in pairs(P.edits) do
            if value ~= nil and value.OriginalValue ~= value.CurrentValue then
                current_edits[address] = value
                P.edit_count = P.edit_count + 1
            end
        end
        P.edits = current_edits
    end
end

P.highlightTile = function(__col, __row, __outline, __fill)
    local left = 16 * (__col - P.scroll_col) - (0xF & P.Memory.ScrollX.Value) + 14
    local top = 16 * (__row - P.scroll_row) - (0xF & P.Memory.ScrollY.Value) - 1
    gui.drawBox(left, top, left + 17, top + 17, __outline, __fill)
end

P.draw = function()
    gui.clearGraphics()
    P.canvas.Clear(0xFF000000)
    P.text(0, 0, "Mode")
    P.text(20, 0, P.mode)
    P.text(0, 1, "TileX")
    P.text(20, 1, P.curr_col)
    P.text(0, 2, "TileY")
    P.text(20, 2, P.curr_row)
    P.text(0, 3, "Stored Background")
    P.text(20, 3, bizstring.hex(P.bg_tile_data))
    P.text(0, 4, "Stored Foreground")
    P.text(20, 4, bizstring.hex(P.fg_tile_data))
    P.text(0, 5, "Edit Count")
    P.text(20, 5, P.edit_count)
    for index, value_name in pairs(P.MemoryKeys) do
        local value = P.Memory[value_name]
        P.text(0, index + 6, value_name)
        P.text(20, index + 6, value.Type)
        P.text(30, index + 6, bizstring.hex(value.Value))
    end
    local box_color = 0xFF999999
    if (P.mode == "FOREGROUND") then
        box_color = 0xFFFFFFFF
    end
    P.highlightTile(P.curr_col, P.curr_row, box_color, 0x00000000)
    if (P.highlightEdits) then
        for address, value in pairs(P.edits) do
            if value ~= nil and value.OriginalValue ~= value.CurrentValue then
                local fill = 0x880000FF
                if (value.Layer == "FOREGROUND") then
                    fill = 0x88FF0000
                end
                P.highlightTile(value.Col, value.Row, 0x00000000, fill)
            end
        end
    end
    P.canvas.Refresh()
end

P.update = function()
    P.room_pointer = (0x1FFFFF & mainmemory.read_u32_le(0x73084))
    for v_name, v_props in pairs(P.Memory) do
        if (v_props.Type == "u8") then
            v_props.Value = mainmemory.read_u8(v_props.Address)
        elseif (v_props.Type == "u16le") then
            v_props.Value = mainmemory.read_u16_le(v_props.Address)
        elseif (v_props.Type == "u32le") then
            v_props.Value = mainmemory.read_u32_le(v_props.Address)
        else
            v_props.Value = mainmemory.read_u32_le(v_props.Address)
        end
    end
end

event.unregisterbyname("TilemapEditor__update")
event.onframeend(P.update, "TilemapEditor__update")

gui.defaultBackground(0xFFFF0000)
-- Mouse and keyboard input
P.curr_keys = input.get()
P.prev_keys = P.curr_keys
P.curr_mouse = input.getmouse()
P.prev_mouse = P.curr_mouse
-- Scroll coordinates are how many tiles the screen has scrolled from the top-left corner of the room
P.scroll_col = 0
P.scroll_row = 0
-- Mouse coordinates are how many tiles the mouse is from the top-left corner from the screen
P.mouse_col = 0
P.mouse_row = 0
-- Tile coordinates are the sum of Mouse coordinates + Scroll coordinates
P.curr_col = 0
P.curr_row = 0
P.prev_col = P.curr_col
P.prev_row = P.curr_row
-- Other editor-specific variables
P.mode = "BACKGROUND"
P.highlightEdits = false
P.bg_tile_data = 0x0000
P.fg_tile_data = 0x0000
P.edits = {}
P.edit_count = 0
-- GUI variables
P.scale = 1.5
P.canvas_width = P.scale * (400)
P.canvas_height = P.scale * (200)
P.canvas = gui.createcanvas(P.canvas_width, P.canvas_height, P.scale * 4, P.scale * 4)
P.canvas.SetTitle("TilemapEditor")

P.update()
while true do
    emu.yield()
    P.update_input()
    P.draw()
end
