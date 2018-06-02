require 'json'

eval(File.read('floors.js.orig'))

new_dungeons = {}
Floors.each{| key,floors |
  new_floors = []

  current_enemies = nil
  floor_begin = nil
  floor_end = nil
  floor_num = nil
  floors.each{| floor |
    floor_num, *enemies = floor
    unless current_enemies
      floor_begin = floor_num
      current_enemies = enemies
    end

    if current_enemies == enemies
      floor_end = floor_num
    else
      new_floors << [floor_begin == floor_end ? floor_begin : "#{floor_begin}〜#{floor_end}", *current_enemies]
      floor_begin = floor_end = floor_num
      current_enemies = enemies
    end
  }
  new_floors << [floor_begin == floor_num ? floor_begin : "#{floor_begin}〜#{floor_end}", *current_enemies]
  new_dungeons[key] = new_floors
}
print 'Floors = '
puts JSON.pretty_generate(new_dungeons)

